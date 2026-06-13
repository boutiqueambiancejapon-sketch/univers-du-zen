# MCP Retina — Accès catalogue depuis Claude

Ce serveur MCP expose le catalogue Retina directement à Claude.
Une fois installé, Claude peut lister, chercher et pusher des produits sans que tu aies à faire quoi que ce soit.

## Installation (2 minutes)

### 1. Installer les dépendances
```bash
cd mcp-retina
npm install
```

### 2. Ajouter dans Claude Desktop
Ouvre le fichier de config Claude Desktop :
- **Mac** : `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows** : `%APPDATA%\Claude\claude_desktop_config.json`

Ajoute dans `mcpServers` :
```json
{
  "mcpServers": {
    "retina-catalog": {
      "command": "node",
      "args": ["/chemin/absolu/vers/nano-banana-app/mcp-retina/index.js"],
      "env": {
        "RETINA_API_TOKEN": "426|HvpBItvAad7gkVtdiaVOtWJkTXDcfi6ellTfR0MY695a39d6",
        "RETINA_API_BASE": "https://app.aiku.io/app/re-api"
      }
    }
  }
}
```

### 3. Redémarrer Claude Desktop
Ferme et relance Claude Desktop. Claude aura alors accès aux outils :
- `retina_list_products` — parcourir le catalogue
- `retina_get_product` — détail d'un produit
- `retina_stock_feed` — stock en temps réel

### 4. Dis à Claude :
> "Pushe les 20 premiers produits du catalogue Retina"

Et Claude fait tout : fetch, génère le contenu FR, push dans le repo.
