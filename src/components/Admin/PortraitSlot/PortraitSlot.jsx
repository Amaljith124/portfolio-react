import React from 'react';
import ImageSlot from '../ImageSlot/ImageSlot';

export default function PortraitSlot({ userId, state, onChanged }) {
  return <ImageSlot label="Portrait" userId={userId} state={state} path={['profile', 'portrait']} keepFlags onChanged={onChanged} />;
}
