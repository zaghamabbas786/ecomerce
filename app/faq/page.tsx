import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Fashion Store, shipping, returns, and more.',
};

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and other secure payment methods. All transactions are processed securely.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery (2-3 business days).',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship internationally to most countries. Shipping times and costs vary by location. Please check the shipping page for more details.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on unworn items with tags attached. Items must be in original condition. Please see our returns page for detailed instructions.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.',
  },
  {
    question: 'Can I cancel or modify my order?',
    answer: 'Orders can be cancelled or modified within 24 hours of placement, as long as they haven\'t been processed for shipping. Contact our support team for assistance.',
  },
  {
    question: 'What sizes do you carry?',
    answer: 'We carry a wide range of sizes from XS to XXL, depending on the item. Size charts are available on each product page to help you find the perfect fit.',
  },
  {
    question: 'Do you have a physical store?',
    answer: 'Currently, we operate as an online-only store. However, we have plans to open physical locations in the future. Stay tuned for updates!',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-center text-muted-foreground mb-12">
          Find answers to common questions about shopping with us.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="text-primary hover:underline font-medium"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
}

