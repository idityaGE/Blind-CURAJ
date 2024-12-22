import { ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BoldCopy from "@/components/animata/text/bold-copy";

type FAQItem = {
  question: string;
  answer: string;
  link?: string;
};

const content: FAQItem[] = [
  {
    question: "Who can use this chat platform?",
    answer: "This platform is exclusively available to students with a valid university email ID. You can only register and login using your official university email address.",
  },
  {
    question: "Why do I need to verify my email address?",
    answer: "Email verification is required to ensure that only current students of our university can access the platform. By verifying your university email address, we maintain a safe and trusted environment where you know you're chatting exclusively with fellow students. This verification process helps prevent unauthorized access and maintains the platform's integrity.",
  },
  {
    question: "Is my identity protected?",
    answer: "Yes, the chat system is completely anonymous. While you log in with your university email, your identity is never revealed to other users. All communications are anonymous to ensure your privacy.",
  },
  {
    question: "Are my chats stored anywhere?",
    answer: "No, we do not store any chat history. Once your chat session ends, all messages are permanently deleted. This ensures complete privacy and confidentiality.",
  },
  {
    question: "Who can I chat with?",
    answer: "You can chat with other students from your university who are also registered on the platform. The system ensures that only verified university students can participate.",
  },
  {
    question: "Is there a code of conduct?",
    answer: "Yes, users are expected to maintain appropriate behavior and respect university policies. Any form of harassment, spam, or inappropriate content is strictly prohibited and may result in account suspension.",
  }
];

const FAQ = () => {
  return (
    <div className="pt-16 pb-8 md:pt-24 md:pb-24 max-w-3xl mx-auto">
      <BoldCopy text="FAQ" className="mb-8 bg-transparent" />
      <h4 className="text-muted-foreground">
        Can&apos;t find the answer you&apos;re looking for? Reach out to our
        customer support team.
      </h4>
      <div className="text-md not-prose mt-4 flex flex-col gap-4 md:mt-8">
        {content.map((item, index) => (
          <Accordion key={index} type="single" collapsible>
            <AccordionItem value={item.question}>
              <AccordionTrigger className="text-left text-md">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base md:w-3/4">
                {item.answer}
                {item.link && (
                  <a
                    href={item.link}
                    className="mt-2 flex w-full items-center opacity-60 transition-all hover:opacity-100"
                  >
                    Learn more <ArrowUpRight className="ml-1" size="16" />
                  </a>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
