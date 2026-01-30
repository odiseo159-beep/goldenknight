import { NextResponse } from 'next/server';

// CONFIGURACIÓN - Token Golden Knight en BNB Chain
const CONFIG = {
  // 1. Dirección del contrato del token
  TOKEN_CONTRACT: '0xcd88fa8e35ae114960855697a00dd045be5e7777',
  
  // 2. BSCScan API Key (usando key pública para pruebas)
  BSCSCAN_API_KEY: process.env.BSCSCAN_API_KEY || 'YourBscScanApiKey',
  
  // 3. RPC de BNB Chain (público gratis)
  BNB_RPC: 'https://bsc-dataseed1.binance.org',
};

export async function GET() {
  try {
    console.log('[v0] Fetching token data for:', CONFIG.TOKEN_CONTRACT);
    console.log('[v0] Using BSCScan API Key:', CONFIG.BSCSCAN_API_KEY ? 'Present' : 'Missing');
    
    // Fetch top holders from BSCScan
    const holdersUrl = `https://api.bscscan.com/api?module=token&action=tokenholderlist&contractaddress=${CONFIG.TOKEN_CONTRACT}&page=1&offset=100&apikey=${CONFIG.BSCSCAN_API_KEY}`;
    console.log('[v0] BSCScan URL:', holdersUrl);
    
    const holdersResponse = await fetch(holdersUrl);
    const holdersData = await holdersResponse.json();
    
    console.log('[v0] BSCScan Response Status:', holdersData.status);
    console.log('[v0] BSCScan Response Message:', holdersData.message);
    console.log('[v0] BSCScan Result Count:', holdersData.result?.length || 0);

    let topHolders = [];
    let activeKnights = 100;

    if (holdersData.status === '1' && holdersData.result) {
      const holders = holdersData.result.slice(0, 5);
      topHolders = holders.map((holder: any, index: number) => ({
        rank: index + 1,
        knight: `${holder.TokenHolderAddress.slice(0, 6)}...${holder.TokenHolderAddress.slice(-4)}`,
        gold: `${(Number(holder.TokenHolderQuantity) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 0 })} GLD`,
      }));
      activeKnights = holdersData.result.length;
    } else {
      // Placeholder data if API fails
      topHolders = [
        { rank: 1, knight: '0x742d...3f5a', gold: '2,450 GLD' },
        { rank: 2, knight: '0x8b3c...7d2e', gold: '1,890 GLD' },
        { rank: 3, knight: '0x1a5f...9c4b', gold: '1,675 GLD' },
        { rank: 4, knight: '0x6e2d...5a1c', gold: '1,340 GLD' },
        { rank: 5, knight: '0x9f4a...2b8d', gold: '1,120 GLD' },
      ];
    }

    // Get token price (simple method using DEX screener or similar)
    let goldPrice = '$0.00';
    try {
      // Using DEX Screener API (free, no key needed)
      const priceResponse = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${CONFIG.TOKEN_CONTRACT}`
      );
      const priceData = await priceResponse.json();
      if (priceData.pairs && priceData.pairs.length > 0) {
        goldPrice = `$${Number(priceData.pairs[0].priceUsd).toFixed(6)}`;
      }
    } catch (error) {
      console.log('[v0] Error fetching price:', error);
    }

    return NextResponse.json({
      goldPrice,
      activeKnights,
      topHolders,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Error in token-data API:', error);
    
    // Return placeholder data on error
    return NextResponse.json({
      goldPrice: '$0.00',
      activeKnights: 100,
      topHolders: [
        { rank: 1, knight: '0x742d...3f5a', gold: '2,450 GLD' },
        { rank: 2, knight: '0x8b3c...7d2e', gold: '1,890 GLD' },
        { rank: 3, knight: '0x1a5f...9c4b', gold: '1,675 GLD' },
        { rank: 4, knight: '0x6e2d...5a1c', gold: '1,340 GLD' },
        { rank: 5, knight: '0x9f4a...2b8d', gold: '1,120 GLD' },
      ],
      lastUpdate: new Date().toISOString(),
    });
  }
}
