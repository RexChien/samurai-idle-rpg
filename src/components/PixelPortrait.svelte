<script lang="ts">
  import { getChibiDataUrl, SPRITE_SPECS, resolveSpriteId } from '../engine/pixelSprites';

  interface Props {
    spriteId: string;
    scale?: number;
    label?: string;
  }

  let { spriteId = 'samurai_general', scale = 2, label = '' }: Props = $props();

  const resolvedId = $derived(resolveSpriteId(spriteId));
  const spec = $derived(SPRITE_SPECS[resolvedId] || SPRITE_SPECS.samurai_general);
  const dataUrl = $derived(getChibiDataUrl(resolvedId, scale));
  const widthPx = $derived(16 * scale);
  const heightPx = $derived(24 * scale);
</script>

<span
  class="pixel-portrait-wrap"
  style="width: {widthPx}px; height: {heightPx}px;"
  title={label || spec.name}
>
  {#if dataUrl}
    <img
      src={dataUrl}
      alt={label || spec.name}
      width={widthPx}
      height={heightPx}
      class="pixel-img"
    />
  {/if}
</span>

<style>
  .pixel-portrait-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    image-rendering: pixelated;
  }

  .pixel-img {
    display: block;
    image-rendering: pixelated;
    user-select: none;
    pointer-events: none;
  }
</style>
