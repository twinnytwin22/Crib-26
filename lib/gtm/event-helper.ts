
// Reuseable GTM Push Event Helper
export function pushGTMEvent(event: string, params: Record<string, any>) {
    if (typeof window === "undefined"  || !window.dataLayer) return;
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params})
}

// Events
let events: any = []

// Get Purchase Events by Users 
const purchases = events
.filter((e: any) => e.name === "purchase")
.map((e: any) => e.userId)

export const usersThatPurchased = [
    ...new Set(purchases)
]

// Fetch user purchase events
fetch("/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json"},
  body: JSON.stringify({ event: "purchase", value: 40, userId: "25369aaa" })
});


// BUy Tickets CTA CLick
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
    event: 'buy_tickets_click',
    cta_location: 'homepage_hero',
    page_type: 'homepage'
})


// Purchase Layer CIA 

window.dataLayer = window.dataLayer || []
window.dataLayer.push({
    event: 'purchase',
    transaction_id: '45667',
    value: 50,
    currency: 'USD',
    items: [
       {item_id: 'shirt.red', item_name: 'Red Shirt'},
       {item_id: 'hat.blue', item_name: 'Blue Hat'}

    ],
    source_location: "checkout_page"
})