export default function extractProcessedLinkedInData(apiResponse: any) {
  const {
    fullName,
    about,
    headline,
    location,
    profile_photo,
    followers,
    connections,
    certification,
    education,
    experience,
    description,
    public_identifier,
    background_cover_image_url,
  } = apiResponse;

  return {
    fullName,
    about,
    headline,
    location,
    profile_photo,
    followers,
    connections,
    certification,
    education,
    experience,
    description,
    public_identifier,
    background_cover_image_url,
  };
}

