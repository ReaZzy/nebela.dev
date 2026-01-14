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
    title: "veeam",
    link: "https://www.veeam.com",
    from: "nov 2024",
    to: "present",
    experience:
      "worldwide leader in backup and data protection. built complex automation and testing infrastructure; now focused on large-scale enterprise frontend",
  },
  {
    title: "radio free europe/radio liberty",
    link: "https://www.rferl.org",
    from: "apr 2023",
    to: "oct 2024",
    experience:
      "global media platform with millions of users. developed a heavily configurable in-house CMS for journalists and maintained public sites",
  },
  {
    title: "campiri",
    link: "https://www.campiri.com",
    from: "jane 2022",
    to: "mar 2023",
    experience:
      "early-stage booking platform for RVs. built most core frontend flows, including booking and messaging",
  },
  {
    title: "dalyoko",
    from: "dec 2021",
    to: "june 2022",
    experience: 'web studio. led a small dev team and worked on "junior" things',
  },
] satisfies WorkExperience[];

const SOCIAL_LINKS = [
  {
    label: "email",
    link: "mailto:maxim.nebela@gmail.com",
  },
  {
    label: "x.com",
    link: "https://x.com/MaximNebela",
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
    city: "prague",
    country: "cz",
  },
  age: getAge(new Date("2005-08-30")),
  position: `software engineer @ ${WORK_EXPERIENCES[0].title}`,
  workExperience: WORK_EXPERIENCES,
  socialLinks: SOCIAL_LINKS,
} as const;
