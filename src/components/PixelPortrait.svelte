<script lang="ts">
  import { getChibiDataUrl, getFullBodyDataUrl, SPRITE_SPECS, resolveSpriteId } from '../engine/pixelSprites';

  interface Props {
    spriteId: string;
    scale?: number;
    label?: string;
    mode?: 'bust' | 'full';
    facing?: 'down' | 'up' | 'left' | 'right';
  }

  let {
    spriteId = 'samurai_general',
    scale = 2,
    label = '',
    mode = 'bust',
    facing = 'left'
  }: Props = $props();

  const resolvedId = $derived(resolveSpriteId(spriteId));
  const spec = $derived(SPRITE_SPECS[resolvedId] || SPRITE_SPECS.samurai_general);
  const dataUrl = $derived(
    mode === 'full'
      ? getFullBodyDataUrl(resolvedId, scale, facing)
      : getChibiDataUrl(resolvedId, Math.max(3, scale))
  );
  const widthPx = $derived(mode === 'full' ? Math.round(32 * scale) : Math.round(28 * scale));
  const heightPx = $derived(mode === 'full' ? Math.round(38 * scale) : Math.round(28 * scale));
</script>

<span
  class="hd-portrait-wrap {mode === 'bust' ? 'bust-frame' : 'full-frame'}"
  style="width: {widthPx}px; height: {heightPx}px;"
  title={label || spec.name}
>
  {#if dataUrl}
    <img
      src={dataUrl}
      alt={label || spec.name}
      width={widthPx}
      height={heightPx}
      class="hd-portrait-img"
    />
  {/if}
</span>

<style>
  .hd-portrait-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .bust-frame {
    border-radius: 6px;
    box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.45);
  }

  .hd-portrait-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    pointer-events: none;
  }
</style>
