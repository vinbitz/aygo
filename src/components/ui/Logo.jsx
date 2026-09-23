import React from 'react';
import wordmarkBlue from '../../assets/brand/wordmark-blue.png';
import wordmarkWhite from '../../assets/brand/wordmark-white.png';
import appIcon from '../../assets/brand/icon-192.png';
import { cx } from './cx';

/**
 * AYGO brand marks.
 * variant="wordmark": the "aygo." logotype (tone blue for light backgrounds, white for blue).
 * variant="icon": the blue app icon with the A + bag mark.
 */
export default function Logo({ variant = 'wordmark', tone = 'blue', className }) {
  if (variant === 'icon') {
    return <img src={appIcon} alt="Aygo" className={cx('rounded-[22%] shrink-0', className || 'w-10 h-10')} />;
  }
  return (
    <img
      src={tone === 'white' ? wordmarkWhite : wordmarkBlue}
      alt="aygo."
      className={cx('w-auto select-none', className || 'h-7')}
      draggable="false"
    />
  );
}
