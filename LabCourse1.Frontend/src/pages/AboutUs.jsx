export default function About() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container-wide grid md:grid-cols-2 gap-12 items-center">
        
        <div>
          <img
            src="/images/about-libraspace.jpg" 
            alt="About LibraSpace"
            className="rounded-xl shadow-lg transform hover:scale-105 transition duration-500"
          />
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-red-600">LibraSpace</span>
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            LibraSpace is more than just a bookstore — we’re a community of readers, dreamers,
            and storytellers. Each month, we handpick the best new titles, host events that
            bring book lovers together, and share stories that inspire.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            From rare classics to fresh releases, our goal is to connect people with books
            they’ll treasure for life. Whether you join us online or visit one of our events,
            you’re part of the LibraSpace family.
          </p>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
