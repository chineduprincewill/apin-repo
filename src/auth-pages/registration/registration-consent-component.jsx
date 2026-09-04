import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import CertifyComponent from './certify-component';

const RegistrationConsentComponent = () => {

    const [isSectionVisible, setIsSectionVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update state when section becomes visible
                setIsSectionVisible(entry.isIntersecting);
            },
            {
                threshold: 0.3, // Trigger when 30% of the section is visible
                rootMargin: '0px',
            }
            );

            const currentSection = sectionRef.current;
            if (currentSection) {
            observer.observe(currentSection);
            }

            return () => {
            if (currentSection) {
                observer.unobserve(currentSection);
            }
        };
    }, []);

    return (
        <div className='w-full grid gap-4 rounded-xl shadow-xl border border-border p-4'>
            <div className='flex items-center gap-2 font-bold text-2xl uppercase mx-auto'>
                <img src='/assets/logo-bg.png' width='50px' />
                <span className='text-blue-500'>apin public health initiatives code of conduct</span>
            </div>
            <h1 className='text-red-600 font-extralight text-xl mx-auto'>
                Please read and certify the document!
            </h1>
            <div className='w-full grid gap-4 rounded-xl border border-border p-6 max-h-[75vh] overflow-y-auto'>
                <span className='text-blue-500 uppercase mx-auto'>code of conduct for vendors and suppliers</span>
                <div className='grid gap-2'>
                    <span className='text-blue-500 uppercase font-semibold'>1.0 PURPOSE</span>
                    <p className='text-muted-foreground text-justify'>APIN is committed to observing the highest ethical standards in all its procurement activities. As such, this Code of Conduct is designed to unambiguously convey APIN’s expectation from its vendors in all of its procurement transactions so that internationally recognized ethics are adhered to. To entrench transparency and accountability in our procurement process, APIN procurement policy is hinged on zero tolerance for corruption, elimination of all forms of conflict of interest and honest representation of vendor’s capabilities. Vendors are therefore encouraged to familiarize themselves with this Code of Conduct in order to ensure successful working relations with APIN.</p>
                </div>
                <div className='grid gap-2'>
                    <span className='text-blue-500 uppercase font-semibold'>2.0 APPLICABILITY OF THE CODE OF CONDUCT</span>
                    <p className='text-muted-foreground text-justify'>This Code of Conduct shall apply to all vendors, suppliers, sub-contractors, consultants, auditors etc. and other entities acting on behalf of them (with approval of APIN).</p>
                </div>
                <div className='grid gap-2'>
                    <span className='text-blue-500 uppercase font-semibold'>3.0 POLICY ON CORRUPTION AND CONFLICT OF INTEREST</span>
                    <p className='text-muted-foreground text-justify'>All vendors seeking to transact business with APIN must conduct their business in accordance with the highest ethical standards. Vendors or potential vendors must strictly adhere to APIN regulations on bribery and corruption and consciously avoid unacceptable business practices by observing the following:
                        <ol className='p-2 grid gap-2'>
                            <li>1. Shall not, directly or indirectly, offer to any APIN Staff money, goods or a service as a consideration or in expectation of a favorable decision, information, opinion, recommendation, vote or any other form of favoritism which qualifies as a corruption.</li>
                            <li>2. Shall not directly or indirectly, offer, give or promise to give to APIN staff any gratuity for the benefit of or at the request of any APIN Staff.</li>
                            <li>3. To immediately inform the APIN Chief Executive Officer in the event that any Staff of APIN solicits, obtains or has made attempt to obtain gratification for himself/herself or for any other persons.</li>
                            <li>4. To immediately declare if the vendor or any of the vendors’ officers or directors had or have any relative employed with APIN. Failure to make such declaration shall be construed as a <b>conflict of interest</b> and might result in the exclusion of the vendor from present and future procurement activities and/or other legal action as deemed fit by the Organization.</li>
                        </ol>
                    </p>
                </div>
                <div className='grid gap-2'>
                    <span className='text-blue-500 uppercase font-semibold'>4.0 REPRESENTATION FROM VENDORS</span>
                    <p className='text-muted-foreground text-justify'>APIN expects all its vendors to honestly declare and warrant that:
                        <ol className='p-2 grid gap-2'>
                            <li>1. It will comply with all rules, regulations and policies of APIN as well as statutory requirements relating to acceptable standards of procurement</li>
                            <li>2. It will not collude with other vendors or agents when participating in a bid.</li>
                            <li>3. It will only supply goods, works and services that are certified to be of merchantable and satisfactory quality.</li>
                            <li>4. The vendor possesses the necessary capabilities, equipment and suitable place of business to perform its obligation.</li>
                            <li>5. It shall not contract out or subcontract or outsource any portion of its procurement contract with APIN unless prior written consent from APIN has been obtained.</li>
                            <li>6. It shall maintain the highest standards of integrity and quality of work at all times.</li>
                        </ol>
                    </p>
                </div>
                <div className='grid gap-2'>
                    <span className='text-blue-500 uppercase font-semibold'>5.0 MONITORING COMPLIANCE</span>
                    <p className='text-muted-foreground text-justify'>To facilitate the monitoring of vendors’ compliance with this Code of Conduct, APIN expects suppliers to:
                        <ol className='p-2 grid gap-2'>
                            <li>1. Develop and maintain all necessary documentations to support compliance with the described standards; such documentation must be accurate and complete.</li>
                            <li>2. Provide APIN’s representatives with access to relevant records, upon APIN’s request.</li>
                            <li>3. Where necessary, allow APIN’s representatives to conduct interviews with the vendor’s employees and management separately.</li>
                            <li>4. Allow APIN’s representatives to conduct announced and unannounced visits to vendor locations.</li>
                            <li>5. Respond promptly to reasonable inquiries from APIN’s representatives in relation to the implementation of the Code of Conduct.</li>
                        </ol>
                    </p>
                </div>
                <div className='grid gap-2'>
                    <span className='text-blue-500 uppercase font-semibold'>6.0 SECURE COMMUNICATION CHANNELS</span>
                    <p className='text-muted-foreground text-justify'>APIN has established a secure communication channel to enable vendors to raise their concerns confidentially and responsibly. If the supplier has questions about the Code of Conduct, he can contact the Procurement Unit for clarification via procurements@apin.org.ng. However, if a vendor wishes to report questionable behavior or possible violation of the Code of Conduct, the vendor is encouraged to report to the APIN Chief Executive Officer at the Abuja head office.</p>
                    <p className='text-muted-foreground text-justify'>All suppliers should note that APIN does not allow or tolerate any retribution or retaliation by anyone against a concerned vendor who has, in good faith, reported questionable behavior and/or a possible violation. APIN shall take disciplinary action up to termination of contract for anyone who threatens or engages in retaliation, retribution or harassment of the concerned individual. Identities and contents of all information or complaints will be treated strictly as confidential.</p>
                </div>
                <div className='grid gap-2'>
                    <span className='text-blue-500 uppercase font-semibold'>7.0 SANCTIONS</span>
                    <p className='text-muted-foreground text-justify'>Breach of the Code of Conduct may result in actions being invoked against that vendor, in addition to any contractual or legal remedies. The actions applied will depend on the nature and seriousness of the breach and on the degree of commitment shown by the vendor in breach to its obligations under the Code of Conduct. The range of actions available to be imposed on the supplier includes but is not restricted to the following:
                        <ol className='p-2 grid gap-2'>
                            <li>1. Formal warnings- that the continued non-compliance will lead to more severe actions.</li>
                            <li>2. Disclosure of nature of breach to all APIN partners and associate organizations.</li>
                            <li>3. Immediate termination of contract without recourse.</li>
                            <li>4. Institution of legal actions/litigations.</li>
                        </ol>
                    </p>
                </div>
                <div className='grid gap-2' ref={sectionRef}>
                    <span className='text-blue-500 uppercase font-semibold'>8.0 VENDOR WARRANTY</span>
                    <p className='text-muted-foreground text-justify'>All vendors and potential vendors are required to read the code of conduct before expressing their interest to work with APIN. By indicating interest to work with APIN, a vendor warrants that he/she has read and understood the requirements contained here and commits to adhere strictly with all its provisions.</p>
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <div className='w-full font-bold text-muted-foreground text-lg'>If you have read and understood the APIN Code of Conduct...</div>
            {
                isSectionVisible &&
                <div className='w-full flex items-center justify-end gap-4 p-4'>
                    <Button 
                        outline="variant" 
                        className="bg-red-600 font-semibold"
                        onClick={() => window.location.reload()}
                    >
                        Decline
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button outline="variant" className="bg-accent font-semibold">
                                Certify
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <CertifyComponent />
                        </DialogContent>
                    </Dialog>
                </div>
            }
            </div>
        </div>
    )
}

export default RegistrationConsentComponent