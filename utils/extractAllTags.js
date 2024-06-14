export function extractAllTags(blogposts) {
    const allTags = new Set();
    blogposts.forEach(post => {
        post.tags.forEach(tag => {
            allTags.add(tag);
        });
    });
    return Array.from(allTags);
}