const features = [
  { tag: '01', title: 'Know your grower', description: 'Every farm profile tells you who produced your food, where it came from, and what makes it special.' },
  { tag: '02', title: 'Buy what is in season', description: 'Browse real listings published by local farmers instead of a fixed catalogue of placeholder produce.' },
  { tag: '03', title: 'Keep value local', description: 'A direct connection gives customers fresher choices and farmers more control over pricing.' },
];

export default function Features() {
  return (
    <section className="bg-[#e5f7e8] px-4 py-20 sm:py-28">
      <div className="section-wrap">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-end">
          <div>
            <span className="eyebrow text-[#155d38]">Why Farm Fresh</span>
            <h2 className="section-title mt-6 text-[#10251a]">Food feels different when you know its story.</h2>
          </div>
          <p className="text-lg sm:text-xl leading-relaxed text-[#40564a] max-w-2xl lg:justify-self-end">
            The marketplace turns anonymous grocery shopping into a relationship between nearby farms and the people they feed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-14">
          {features.map((feature, index) => (
            <article key={feature.title} className={`rounded-[2rem] p-7 sm:p-8 min-h-72 flex flex-col justify-between border ${index === 1 ? 'bg-[#f4511e] border-[#f4511e] text-white md:-translate-y-5' : 'bg-[#fffef8] border-[#155d38]/15 text-[#10251a]'}`}>
              <span className="text-xs font-black tracking-[0.16em] opacity-60">{feature.tag}</span>
              <div>
                <h3 className="text-2xl font-black tracking-[-0.04em]">{feature.title}</h3>
                <p className={`mt-3 leading-relaxed ${index === 1 ? 'text-white/75' : 'text-[#607068]'}`}>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
