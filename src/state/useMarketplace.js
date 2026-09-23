import { useCallback, useEffect, useReducer, useRef } from 'react';
import { makeBid, matchSuppliers, respondToCounter } from '../lib/marketplace';

// Demo request shown on first load, with its offers already in
const SEED_REQUEST = {
  id: 'req-seed',
  title: '300 customized satin lanyards',
  quantity: 300,
  unit: 'pcs',
  targetBudget: 15000,
  category: 'event-print',
  categories: ['event-print'],
  isPackage: false,
  location: 'Arthaland Century Pacific Tower, BGC, Taguig',
  deliveryDate: '2026-10-15',
  specs: '2cm smooth satin, full color 2-sided sublimation, trigger hook.',
  createdAt: '2026-09-20T09:00:00.000Z',
};

function withBids(request, delayed) {
  const makers = matchSuppliers(request);
  const bids = makers.map((s, i) => makeBid(request, s, i));
  return {
    ...request,
    status: 'bidding',
    matchedCount: makers.length,
    bids: delayed ? [] : bids,
    pendingBids: delayed ? bids : [],
    acceptedBidId: null,
    orderStep: 0,
  };
}

const initialState = {
  requests: [withBids(SEED_REQUEST, false)],
  activeRequestId: SEED_REQUEST.id,
};

function updateRequest(state, id, fn) {
  return { ...state, requests: state.requests.map((r) => (r.id === id ? fn(r) : r)) };
}

function reducer(state, action) {
  switch (action.type) {
    case 'create':
      return { requests: [action.request, ...state.requests], activeRequestId: action.request.id };
    case 'bidArrived':
      return updateRequest(state, action.requestId, (r) => {
        const bid = r.pendingBids.find((b) => b.id === action.bidId);
        if (!bid) return r;
        return { ...r, bids: [...r.bids, bid], pendingBids: r.pendingBids.filter((b) => b.id !== action.bidId) };
      });
    case 'accept':
      return updateRequest(state, action.requestId, (r) => ({
        ...r,
        status: 'booked',
        acceptedBidId: action.bidId,
        pendingBids: [],
        bids: r.bids.map((b) => ({ ...b, status: b.id === action.bidId ? 'accepted' : 'declined' })),
      }));
    case 'counter':
      return updateRequest(state, action.requestId, (r) => ({
        ...r,
        bids: r.bids.map((b) => (b.id === action.bidId ? { ...b, status: 'countered', counterPrice: action.price } : b)),
      }));
    case 'counterReply':
      return updateRequest(state, action.requestId, (r) => ({
        ...r,
        bids: r.bids.map((b) =>
          b.id === action.bidId
            ? { ...b, status: 'pending', pricePerUnit: action.pricePerUnit, total: action.pricePerUnit * r.quantity, counterPrice: null, revised: true }
            : b
        ),
      }));
    case 'select':
      return { ...state, activeRequestId: action.id };
    default:
      return state;
  }
}

/**
 * Organizer-side marketplace state: requests, streaming offers, accept and counter-offer.
 * Offers "arrive" over a few seconds to mirror suppliers responding live.
 */
export default function useMarketplace({ onEvent } = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timers = useRef([]);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const createRequest = useCallback((draft) => {
    const request = withBids({ ...draft, id: `req-${Date.now()}`, createdAt: new Date().toISOString() }, true);
    dispatch({ type: 'create', request });
    request.pendingBids.forEach((bid) =>
      later(() => {
        dispatch({ type: 'bidArrived', requestId: request.id, bidId: bid.id });
        onEventRef.current?.({ type: 'bid', request, bid });
      }, bid.arrivalDelayMs)
    );
    return request;
  }, []);

  const acceptBid = useCallback((requestId, bidId) => dispatch({ type: 'accept', requestId, bidId }), []);

  const counterBid = useCallback((request, bid, price) => {
    dispatch({ type: 'counter', requestId: request.id, bidId: bid.id, price });
    later(() => {
      const reply = respondToCounter(bid, price);
      dispatch({ type: 'counterReply', requestId: request.id, bidId: bid.id, pricePerUnit: reply.pricePerUnit });
      onEventRef.current?.({ type: 'counterReply', request, bid, ...reply });
    }, 1800);
  }, []);

  const selectRequest = useCallback((id) => dispatch({ type: 'select', id }), []);

  const activeRequest = state.requests.find((r) => r.id === state.activeRequestId) || null;
  const matchesMade = state.requests.filter((r) => r.status === 'booked').length;

  return { ...state, activeRequest, matchesMade, createRequest, acceptBid, counterBid, selectRequest };
}
