import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Функция для отдачи локальной заглушки со статусом 200 OK
async function returnFallbackImage(req: NextRequest) {
  try {
    // Формируем абсолютный URL к локальному файлу заглушки
    const fallbackUrl = new URL('/images/no-photo.png', req.url);
    const res = await fetch(fallbackUrl);

    if (!res.ok) throw new Error('Fallback image not found');

    const buffer = await res.arrayBuffer();
    return new NextResponse(new Uint8Array(buffer), {
      status: 200, // ГУГЛ ВИДИТ УСПЕХ
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, s-maxage=86400', // Кэшируем заглушку на сутки
      },
    });
  } catch (error) {
    // Если даже заглушка удалена, отдаем пустой прозрачный пиксель, чтобы не было 404
    const transparentPixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );
    return new NextResponse(new Uint8Array(transparentPixel), {
      status: 200,
      headers: { 'Content-Type': 'image/png' },
    });
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  // Если ссылки нет вообще — сразу отдаем заглушку как валидное фото
  if (!url || url === 'null' || url === 'undefined') {
    return returnFallbackImage(req);
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 2592000 },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });

    // ЕСЛИ CDN ПОСТАВЩИКА ЛЕЖИТ ИЛИ ФОТО УДАЛЕНО (404, 403, 500)
    // Мы перехватываем ошибку и отдаем Гуглу нашу заглушку со статусом 200
    if (!res.ok) {
      return returnFallbackImage(req);
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();

    // Возвращаем реальное фото
    return new NextResponse(new Uint8Array(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control':
          'public, s-maxage=2592000, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    // Тайм-аут или невалидный URL — спасаем ситуацию заглушкой
    return returnFallbackImage(req);
  }
}
