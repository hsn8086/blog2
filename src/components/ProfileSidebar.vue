<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, Tags, Link } from "lucide-vue-next";
import { userName, bio, avatarUrl, tags } from "@/blog.config";

// const tags = ["Vue", "TypeScript", "Astro", "Rust", "Tailwind"];
</script>

<template>
    <aside
        class="flex flex-col items-center gap-3 md:gap-5 py-4 md:py-8 px-4 md:px-6 w-full md:w-64 h-auto md:h-full"
    >
        <!-- Avatar -->
        <div class="relative group">
            <Avatar
                size="lg"
                class="h-16 w-16 md:h-24 md:w-24 border-2 border-muted transition-transform duration-300 group-hover:scale-105"
            >
                <AvatarImage :src="avatarUrl" alt="avatar" />
                <AvatarFallback>{{ userName[0].toUpperCase() }}</AvatarFallback>
            </Avatar>
        </div>

        <!-- Name & Bio -->
        <div class="flex flex-col items-center gap-1 text-center">
            <h2 class="text-lg md:text-xl font-bold tracking-tight text-foreground">
                {{ userName }}
            </h2>
            <p class="text-xs md:text-sm text-muted-foreground leading-relaxed">{{ bio }}</p>
        </div>
        <div class="hidden md:block w-full">
            <Separator />

            <!-- Social Links -->

            <nav class="flex flex-row md:flex-col justify-center gap-4 md:gap-3 items-center mt-4">
                <a
                    href="/"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                    <Home class="size-5 md:size-4" />
                    <span>Home</span>
                </a>
                <a
                    href="/tags"
                    class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                    <Tags class="size-5 md:size-4" />
                    <span>Tags</span>
                </a>
                <a
                    href="/links"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                    <Link class="size-5 md:size-4" />
                    <span>Links</span>
                </a>
            </nav>
        </div>
        <Separator class="hidden md:block" />

        <!-- Tags -->
        <div class="hidden md:flex flex-wrap justify-center gap-2 pt-2">
            <Badge
                v-for="tag in tags"
                :key="tag"
                variant="secondary"
                class="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold"
            >
                {{ tag }}
            </Badge>
        </div>
    </aside>
</template>
