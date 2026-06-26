export interface Release {
  id: number;
  name: string;
  tag_name: string;
  body: string; // Obsah release notes (Markdown)
  published_at: string;
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  };
}

export async function getReleases(): Promise<Release[]> {
  // Nahraď 'Topeez' a 'LoveSync' skutečným vlastníkem a názvem repozitáře
  const res = await fetch(
    "https://api.github.com/repos/Topeez/LoveSync/releases",
    {
      next: { revalidate: 3600 }, // Cache na 1 hodinu, aby se nepřečerpal limit API
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    // Fallback pokud API selže (nebo limit rate)
    console.error("Failed to fetch releases", await res.text());
    return [];
  }

  return res.json();
}
