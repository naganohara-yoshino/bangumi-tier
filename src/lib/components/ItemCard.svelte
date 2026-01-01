<script lang="ts">
  let { name, image } = $props();
  image = image ?? "https://lain.bgm.tv/img/no_icon_subject.png";
</script>

<div
  class="group/card relative flex h-28 w-20 flex-col select-none border-2 border-border bg-card"
>
  <div
    class="relative w-full flex-grow overflow-hidden border-b-2 border-border bg-muted"
  >
    <img
      src={image}
      alt={name}
      draggable="false"
      class="absolute inset-0 h-full w-full object-cover object-top"
    />
  </div>

  <div
    class="flex h-5 w-full items-center justify-center overflow-hidden bg-card transition-colors duration-150 group-hover/card:bg-accent"
  >
    <span
      class="truncate px-1 font-mono text-[9px] font-bold uppercase leading-none tracking-tight text-foreground"
      title={name}
    >
      {name}
    </span>
  </div>
</div>
