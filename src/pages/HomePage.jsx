import MainNavbar from "../components/MainNavbar";
import Intro from "../components/Intro";
import StepsSection from "../components/StepsSection";
import StatsSection from "../components/StatsSection";
import ActionSection from "../components/ActionSection";
import MainFooter from "../components/MainFooter";

const HomePage = () => {
  return (
    <div>
      <MainNavbar />
      <Intro />
      <StepsSection />
      <StatsSection />
      <ActionSection />
      <MainFooter />
    </div>
  );
};

export default HomePage;
