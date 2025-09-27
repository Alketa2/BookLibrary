export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "5 Must-Read Books This Fall",
      excerpt: "Discover our staff picks for the season — from thrillers to inspiring memoirs.",
      image: "/images/foto1.jpg"
    },
    {
      id: 2,
      title: "Author Spotlight: Jane Doe",
      excerpt: "Get to know the writer behind this year’s bestseller and her creative journey.",
      image: "/images/foto2.jpg"
    },
    {
      id: 3,
      title: "How to Build a Reading Habit",
      excerpt: "Practical tips for making books a joyful part of your daily routine.",
      image: "/images/foto3.jpg"
    }
  ]

  return (
    <section className="bg-white py-20">
      <div className="container-wide text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Our <span className="text-red-600">Blog</span>
        </h1>
        <p className="text-lg text-gray-600">
          Book reviews, author interviews, and reading tips from our team.
        </p>
      </div>

      <div className="container-wide grid md:grid-cols-3 gap-8">
        {posts.map(post => (
          <article
            key={post.id}
            className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-500"
          >
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6 text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <button className="text-red-600 hover:underline font-medium">Read More →</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
