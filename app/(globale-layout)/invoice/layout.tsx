export default function InvoiceLayout ({children}: {children: React.ReactNode}) {
    return (
        <main className="flex justify-center relative">
            {children}
        </main>
    )
}