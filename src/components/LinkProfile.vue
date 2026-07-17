<script setup lang="ts">
interface Props {
    avatarUrl?: string;
    name?: string;
    description?: string;
    url?: string;
}

withDefaults(defineProps<Props>(), {
    avatarUrl: "",
    name: "",
    description: "",
    url: "",
});
</script>

<template>
    <a
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
        <div class="relative group">
            <img
                :src="avatarUrl"
                :alt="`${name} 的头像`"
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
                class="size-10 shrink-0 rounded-full bg-muted object-cover"
            />
        </div>
        <div>
            <h2 class="font-semibold">{{ name }}</h2>
            <p class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
    </a>
</template>
