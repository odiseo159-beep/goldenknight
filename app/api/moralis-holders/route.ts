import { NextResponse } from 'next/server';

const MORALIS_CONFIG = {
  API_KEY: process.env.MORALIS_API_KEY || '',
  TOKEN_CONTRACT: '0xcd88fa8e35ae114960855697a00dd045be5e7777',
  CHAIN: 'bsc',
};

export async function GET() {
  try {
    console.log('[v0] Fetching holders from Moralis API');
    console.log('[v0] Token:', MORALIS_CONFIG.TOKEN_CONTRACT);
    console.log('[v0] API Key present:', !!MORALIS_CONFIG.API_KEY);

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${MORALIS_CONFIG.TOKEN_CONTRACT}/owners?chain=${MORALIS_CONFIG.CHAIN}&order=DESC`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': MORALIS_CONFIG.API_KEY,
      },
    });

    if (!response.ok) {
      console.log('[v0] Moralis API error:', response.status, response.statusText);
      throw new Error(`Moralis API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[v0] Moralis response received, holders count:', data.result?.length || 0);

    if (!data.result || data.result.length === 0) {
      console.log('[v0] No holders found, returning placeholder data');
      return NextResponse.json({
        topHolders: [
          { rank: 1, knight: '0x742d...3f5a', gold: '2,450 $龙脉金骑' },
          { rank: 2, knight: '0x8b3c...7d2e', gold: '1,890 $龙脉金骑' },
          { rank: 3, knight: '0x1a5f...9c4b', gold: '1,675 $龙脉金骑' },
          { rank: 4, knight: '0x6e2d...5a1c', gold: '1,340 $龙脉金骑' },
          { rank: 5, knight: '0x9f4a...2b8d', gold: '1,120 $龙脉金骑' },
        ],
        activeKnights: 0,
      });
    }

    // Mapear los primeros 5 holders
    const topHolders = data.result.slice(0, 5).map((holder: any, index: number) => {
      const address = holder.owner_of || holder.owner_address || '';
      const balance = holder.balance || '0';
      
      // Formatear address
      const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
      
      // Convertir balance de wei a tokens (dividir por 10^18)
      const balanceInTokens = Number(balance) / 1e18;
      const formattedBalance = `${balanceInTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} $龙脉金骑`;
      
      return {
        rank: index + 1,
        knight: formattedAddress,
        gold: formattedBalance,
      };
    });

    console.log('[v0] Processed top 5 holders:', topHolders.length);

    return NextResponse.json({
      topHolders,
      activeKnights: data.result.length,
    });
  } catch (error) {
    console.error('[v0] Error fetching Moralis data:', error);
    
    // Return placeholder data on error
    return NextResponse.json({
      topHolders: [
        { rank: 1, knight: '0x742d...3f5a', gold: '2,450 $龙脉金骑' },
        { rank: 2, knight: '0x8b3c...7d2e', gold: '1,890 $龙脉金骑' },
        { rank: 3, knight: '0x1a5f...9c4b', gold: '1,675 $龙脉金骑' },
        { rank: 4, knight: '0x6e2d...5a1c', gold: '1,340 $龙脉金骑' },
        { rank: 5, knight: '0x9f4a...2b8d', gold: '1,120 $龙脉金骑' },
      ],
      activeKnights: 0,
    });
  }
}
