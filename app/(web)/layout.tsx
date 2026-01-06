import type React from "react"
import Headers from "@/components/header"
import Footer from "@/components/footer"

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Headers />
            {children}
            <Footer />
        </>
    )
}
