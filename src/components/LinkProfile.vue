<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            <Avatar>
                <AvatarImage :src="avatarUrl" :alt="name" />
                <AvatarFallback>{{ name.charAt(0) }}</AvatarFallback>
            </Avatar>
        </div>
        <div>
            <p class="font-semibold">{{ name }}</p>
            <p class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
    </a>
</template>
