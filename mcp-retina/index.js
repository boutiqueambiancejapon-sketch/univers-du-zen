#!/usr/bin/env node
/**
 * MCP Server — Retina API
 * Lance depuis ta machine : node mcp-retina/index.js
 * Puis ajoute-le dans Claude Desktop claude_desktop_config.json
 */

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');

const BASE = process.env.RETINA_API_BASE || 'https://app.aiku.io/app/re-api';
const TOKEN = process.env.RETINA_API_TOKEN || '';

if (!TOKEN) {
  process.stderr.write('RETINA_API_TOKEN manquant\n');
  process.exit(1);
}

async function retinaFetch(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Retina ${res.status}: ${await res.text()}`);
  return res.json();
}

const server = new McpServer({
  name: 'retina-catalog',
  version: '1.0.0',
});

// ---- Outil 1 : lister les produits ----------------------------------------
server.tool(
  'retina_list_products',
  'Liste les produits du catalogue fournisseur avec pagination',
  {
    page: z.number().optional().default(1).describe('Numéro de page'),
    per_page: z.number().optional().default(20).describe('Produits par page (max 50)'),
    search: z.string().optional().describe('Recherche par nom ou SKU'),
  },
  async ({ page, per_page, search }) => {
    const params = { page, per_page };
    if (search) params.search = search;
    const data = await retinaFetch('/products', params);
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ---- Outil 2 : détail d'un produit -----------------------------------------
server.tool(
  'retina_get_product',
  'Récupère le détail complet d’un produit par ID',
  {
    id: z.number().describe('ID du produit Retina'),
  },
  async ({ id }) => {
    const data = await retinaFetch(`/products/${id}`);
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ---- Outil 3 : stock feed --------------------------------------------------
server.tool(
  'retina_stock_feed',
  'Récupère le stock en temps réel de tous les produits',
  {},
  async () => {
    const data = await retinaFetch('/stock-feed');
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ---- Démarrage --------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('MCP Retina prêt ✓\n');
}

main().catch(err => {
  process.stderr.write(`Erreur: ${err.message}\n`);
  process.exit(1);
});
