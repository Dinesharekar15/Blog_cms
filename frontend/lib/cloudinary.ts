/**
 * Converts a Cloudinary public_id or a full URL to a displayable image URL.
 * Returns null if no value is provided.
 */
export function getProfileImageUrl(profileImg: string | null | undefined): string | null {
  if (!profileImg) return null;
  // Already a full URL (e.g. from Google OAuth or old data)
  if (profileImg.startsWith('http')) return profileImg;
  // Cloudinary public_id → build URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxneefoku';
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_fill,g_face/${profileImg}`;
}
