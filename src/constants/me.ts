import { getAge } from "@/utils/getAge";

export interface WorkExperience {
  title: string;
  link?: string;
  from: string;
  to: string;
  experience: string;
}

const WORK_EXPERIENCES = [
  {
    title: "Veeam",
    link: "https://www.veeam.com",
    from: "Nov 2024",
    to: "Present",
    experience:
      "Worldwide leader in backup and data protection. Built complex automation and testing infrastructure; now focused on large-scale enterprise frontend",
  },
  {
    title: "Radio Free Europe/Radio Liberty",
    link: "https://www.rferl.org",
    from: "Apr 2023",
    to: "Oct 2024",
    experience:
      "Global media platform with millions of users. Developed a heavily configurable in-house CMS for journalists and maintained public sites",
  },
  {
    title: "Campiri",
    link: "https://www.campiri.com",
    from: "Jane 2022",
    to: "Mar 2023",
    experience:
      "Early-stage booking platform for RVs. Built most core frontend flows, including booking and messaging",
  },
  {
    title: "dalyoko",
    from: "dec 2021",
    to: "june 2022",
    experience: 'Web studio. Led a small dev team and worked on "junior" things',
  },
] satisfies WorkExperience[];

const SOCIAL_LINKS = [
  {
    label: "email",
    link: "mailto:maxim.nebela@gmail.com",
  },
  {
    label: "x.com",
    link: "https://x.com/nebelamaksym",
  },
  {
    label: "linkedin",
    link: "https://www.linkedin.com/in/maxim-nebela/",
  },
  {
    label: "github",
    link: "https://github.com/ReaZzy",
  },
  {
    label: "cv",
    link: "/cv",
  },
] as const;

export const ME = {
  name: "maksym nebela",
  location: {
    city: "Prague",
    country: "CZ",
  },
  age: getAge(new Date("2005-08-30")),
  position: `Software Engineer @ ${WORK_EXPERIENCES[0].title}`,
  workExperience: WORK_EXPERIENCES,
  socialLinks: SOCIAL_LINKS,
} as const;
