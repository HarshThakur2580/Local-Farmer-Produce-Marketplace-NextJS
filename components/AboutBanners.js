import Image from 'next/image';

export default function AboutBanners() {
  return (
    <div className="grid grid-cols-[1.3fr_0.7fr] gap-4 min-h-[34rem]">
      <div className="relative overflow-hidden rounded-[2.5rem]">
        <Image src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1100&q=86" alt="A farmer working among green crops" fill sizes="(min-width: 1024px) 48vw, 65vw" className="object-cover" />
      </div>
      <div className="grid gap-4 py-7">
        <div className="relative overflow-hidden rounded-full"><Image src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=85" alt="Farm landscape at sunrise" fill sizes="24vw" className="object-cover" /></div>
        <div className="relative overflow-hidden rounded-full"><Image src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=700&q=85" alt="Fresh vegetables on a farm" fill sizes="24vw" className="object-cover" /></div>
      </div>
    </div>
  );
}
