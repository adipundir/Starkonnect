import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PrivacyPolicy() {
    return (
        <div className="container mt-20 mx-auto py-8 px-4 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
                    <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6">
                       This Privacy Policy outlines how ✨Starkonnect collect, use, and protect your personal information.
                        Please read this policy carefully to understand our practices regarding your data.
                    </p>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="data-collection">
                            <AccordionTrigger>Data Collection and Public Use</AccordionTrigger>
                            <AccordionContent>
                                <p>By using our platform, you acknowledge and agree that:</p>
                                <ul className="list-disc pl-6 mt-2 space-y-2">
                                    <li>You are knowingly and voluntarily providing your personal data.</li>
                                    <li>The data you provide will be used publicly on our platform.</li>
                                    <li>Your profile information will be visible to other users and visitors of the platform.</li>
                                    <li>We may use your data to improve our services and user experience.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="future-compensation">
                            <AccordionTrigger>Future Compensation for Data</AccordionTrigger>
                            <AccordionContent>
                                <p>We value your contribution to our platform. As compensation program for users who provide their profile data to the platform. Please note:</p>
                                <ul className="list-disc pl-6 mt-2 space-y-2">
                                    <li>The compensation program is currently under development and finalisation are yet to be made.</li>
                                    <li>Once finalised, users may be eligible to receive payment for the profile data they provide.</li>
                                    <li>Details of the compensation structure will be communicated separately when the program is finalised.</li>
                                    <li>Participation in the compensation program will be optional.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="data-protection">
                            <AccordionTrigger>Data Protection and Security</AccordionTrigger>
                            <AccordionContent>
                                <p>We are committed to protecting your data. Our security measures include:</p>
                                <ul className="list-disc pl-6 mt-2 space-y-2">
                                    <li>Encryption of sensitive information during transmission.</li>
                                    <li>Regular security audits and updates to our systems.</li>
                                    <li>Strict access controls for our staff and partners.</li>
                                    <li>Compliance with applicable data protection laws and regulations.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="user-rights">
                            <AccordionTrigger>Your Rights and Choices</AccordionTrigger>
                            <AccordionContent>
                                <p>You have certain rights regarding your personal data:</p>
                                <ul className="list-disc pl-6 mt-2 space-y-2">
                                    <li>The right to access and update your personal information.</li>
                                    <li>The right to request deletion of your data, subject to our legal obligations.</li>
                                    <li>The right to opt-out of certain data uses or sharing.</li>
                                    <li>The right to be informed about significant changes to this privacy policy.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <p className="mt-6">
                        By using our platform, you consent to the practices described in this Privacy Policy.
                        We reserve the right to update this policy periodically, and we encourage you to review it regularly.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

