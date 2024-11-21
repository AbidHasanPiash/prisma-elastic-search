import { cn } from "@/lib/utils";

export const metadata = {
    title: 'Auth - Login',
    description: 'Abid Hasan - Frontend Developer specializing in React, Next.js, and more.',
    image: '/image/image/hero-sm.jpg',
}

export default function Layout({ children }) {
    return (
        <div
            className={cn(
                "bg-muted h-screen w-full overflow-y-auto",
                "flex items-center justify-center"
            )}
        >
            {children}
        </div>
    )
}
