export const createPosts = async () => {
    const response = await fetch('https://neoarts-f6b6f4eaebgtdrga.canadacentral-01.azurewebsites.net/SocialMedia/CreateInstagramPosts');
    const data = await response.json();
    return data;
}

