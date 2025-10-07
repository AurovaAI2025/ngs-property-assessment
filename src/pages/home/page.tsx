
import Hero from './components/Hero';
import WhoShouldTake from './components/WhoShouldTake';
import HowItWorks from './components/HowItWorks';
import HowYouAreScored from './components/HowYouAreScored';
import UnlockPotential from './components/UnlockPotential';
import ReadyToStrengthen from './components/ReadyToStrengthen';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhoShouldTake />
      <HowItWorks />
      <HowYouAreScored />
      <UnlockPotential />
      <ReadyToStrengthen />
    </div>
  );
}
