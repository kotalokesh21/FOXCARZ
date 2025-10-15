import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What documents do I need to rent a car?",
    answer: "To rent a car from FOXCARZ, you'll need:\n- A valid driver's license\n- Valid government-issued ID\n- Credit/Debit card for payment\n- Driver's license should be at least 1 year old",
  },
  {
    question: "Is there a security deposit?",
    answer: "No, FOXCARZ operates on a zero-deposit policy. We trust our customers and aim to make the rental process as hassle-free as possible. However, valid payment information is required at the time of booking.",
  },
  {
    question: "What is your fuel policy?",
    answer: "We follow a 'Same-to-Same' fuel policy. This means you'll receive the car with a full tank and should return it with a full tank. This ensures transparency and fairness in fuel charges.",
  },
  {
    question: "Are there any mileage restrictions?",
    answer: "No, we offer unlimited kilometers on all our rentals. Drive as much as you want without worrying about additional charges for extra kilometers.",
  },
  {
    question: "What happens if I return the car late?",
    answer: "We provide a grace period of 1 hour. Beyond that, you'll be charged for an additional day. We recommend contacting our customer support if you expect to be late.",
  },
  {
    question: "Is insurance included in the rental price?",
    answer: "Yes, basic insurance is included in all our rentals. This covers third-party liability. Additional comprehensive insurance packages are available for extra protection.",
  },
  {
    question: "Can I modify or cancel my booking?",
    answer: "Yes, you can modify or cancel your booking up to 24 hours before the rental start time. Cancellations made within 24 hours may incur a charge.",
  },
  {
    question: "What is your pickup and drop-off policy?",
    answer: "We offer both airport and city location pickup/drop-off services. You can choose your preferred location during booking. Door-step delivery is available in select areas for an additional charge.",
  },
  {
    question: "What happens if the car breaks down?",
    answer: "We provide 24/7 roadside assistance. In case of a breakdown, contact our emergency support number, and we'll arrange for immediate assistance or a replacement vehicle.",
  },
  {
    question: "Do you offer long-term rentals?",
    answer: "Yes, we offer special rates for long-term rentals (weekly and monthly). Contact our customer service for customized long-term rental packages.",
  },
];

export default function FAQ() {
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our car rental services
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">
          Can't find the answer you're looking for? Please contact our support team.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="tel:+919000478478"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Call Support
          </a>
          <a
            href="https://wa.me/919000478478"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}