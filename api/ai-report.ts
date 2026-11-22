import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orders = [], products = [], period = 'today' } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback if no API key is configured yet
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      const pendingDeliveries = orders.filter((o: any) => o.status !== 'Delivered').length;
      return res.status(200).json({
        summary: `📊 Executive Daily Briefing for Packed by Dolyn\nGenerated for: Gwendolyn Barnie Boahen (Business Owner)\n\n• Sales & Revenue: Total order volume GH₵ ${totalRevenue.toFixed(2)} across ${orders.length} orders.\n• Order Fulfillment: ${pendingDeliveries} dispatch(es) scheduled across Greater Accra and regional couriers.\n• Key Categories: Whipped Shea Butter, Perfume Mists, Custom Gift Hampers, and Essential Pharmaceuticals.\n• Action Recommendations:\n  1. Review upcoming scheduled deliveries for corporate gift hampers.\n  2. Restock 250ml Whipped Shea Butter and Vitamin C 1000mg effervescent.\n  3. Verify Mobile Money payment receipts prior to third-party courier dispatch.`
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are the executive AI Business Assistant for "Packed by Dolyn" (Ghana), managed by Gwendolyn Barnie Boahen.
The company specializes in:
1. Pure Shea butter products & handcrafted cosmetics
2. Custom gift packaging & corporate event hampers
3. Fragrances, body splashes & mists
4. Household sanitary items & cleaning essentials
5. Essential pharmacy products, drugs & healthcare supplies

Current Orders Data:
${JSON.stringify(orders, null, 2)}

Product Catalog & Inventory Sample:
${JSON.stringify(products?.slice(0, 15), null, 2)}

Reporting Period: ${period}

Write an executive, structured, professional operational report for Gwendolyn in Ghana Cedis (GH₵). Include:
1. 📈 Executive Revenue & Volume Summary (total revenue, average order value, payment method breakdown MoMo vs Card)
2. 🚚 Order Fulfillment & Logistics Status (Same-day Accra deliveries, regional shipments, customer pickups)
3. 📦 Inventory & Stock Alerts (low stock warning, high demand items, out-of-stock pre-orders)
4. 🎀 Custom Gift & Event Packaging Requests (special customer notes, ribbon preferences)
5. 💡 Strategic Next Steps for Today. Keep it concise, actionable, and formatted in clear sections.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.status(200).json({ summary: response.text });
  } catch (error: any) {
    console.error('Error generating AI report:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate AI report',
      fallback: 'Operational summary service temporarily unavailable. Please verify connection and retry.'
    });
  }
}
