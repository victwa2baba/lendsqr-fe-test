import { NextResponse } from 'next/server';

const USERS_TEMPLATE_URL =
  'https://api.json-generator.com/templates/N4fKbdXR69uP/data';

export async function GET() {
  const token = process.env.JSON_GENERATOR_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { message: 'Missing JSON_GENERATOR_API_TOKEN environment variable.' },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(USERS_TEMPLATE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        {
          message: 'Failed to fetch users from JSON Generator API.',
          details: details || response.statusText,
        },
        { status: response.status },
      );
    }

    const users = (await response.json()) as unknown;

    if (!Array.isArray(users)) {
      return NextResponse.json(
        { message: 'Unexpected users payload received from upstream API.' },
        { status: 502 },
      );
    }

    return NextResponse.json(users);
  } catch (error) {
    const details =
      error instanceof Error ? error.message : 'Unknown error occurred.';

    return NextResponse.json(
      {
        message: 'Unable to reach JSON Generator API.',
        details,
      },
      { status: 502 },
    );
  }
}
