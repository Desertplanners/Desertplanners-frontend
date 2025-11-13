
import BannerSection from '../components/Home/BannerSection'
import HolidayPackages from '../components/Home/HolidayPackages'
import PopularExperiences from '../components/Home/PopularExperiences'
import TestimonialSection from '../components/Home/TestimonialSection'
import TopAttractions from '../components/Home/TopAttractions'
import TopCities from '../components/Home/TopCities'
import TopThingsToDo from '../components/Home/TopThingsToDo'
import TravelInspiration from '../components/Home/TravelInspiration'
import UAEVisaServices from '../components/Home/UAEVisaServices'
import WhyBookWithUs from '../components/Home/WhyBookWithUs'
function Home() {
  return (
    <>
    <BannerSection />
    <TopCities />
    <TopAttractions />
    {/* <HolidayPackages /> */}
    <PopularExperiences />
    {/* <TopThingsToDo /> */}
    <UAEVisaServices />
    <WhyBookWithUs />
    <TravelInspiration />
    <TestimonialSection />
    </>
  )
}

export default Home
  