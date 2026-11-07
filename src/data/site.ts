// Personal facts shown on the site. Everything here is real; edit only with real data.
export const site = {
  name: "Abdullah Gamal",
  fullName: "Abdullah Jamal Abdul Muttalib",
  title: "Backend-focused Full-Stack Engineer",
  location: "Egypt",
  timezone: "Cairo (GMT+2/+3)",
  email: "abdullahgamal.pvt@gmail.com",
  phone: { display: "+20 102 835 8352", href: "tel:+201028358352" },
  cv: "/abdullah-gamal-cv.pdf",
  links: [
    { label: "GitHub", href: "https://github.com/Gemycode" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abdullah-jamal0/" },
    // Add Upwork here once the profile URL is confirmed:
    // { label: "Upwork", href: "https://www.upwork.com/freelancers/..." },
  ],
} as const

// Numbers counted from git history and the codebases (Nov 2025 → Nov 2026).
export const metrics = [
  { value: 657, label: "Commits shipped", note: "in the last 12 months" },
  { value: 14, label: "Projects delivered", note: "since November 2025" },
  { value: 431, label: "API endpoints", note: "in backends I built solo" },
  { value: 9, label: "Production domains", note: "live right now" },
] as const
