import Image from "next/image";
import chwckwithshadow from "@/src/assets/images/registeration/chwckwithshadow.svg"


export default function CongatsCard({ title ,description}) {
   
    return (
        <div className="modal-overlay">
            <div className="success-modal">
                <div className="success-icon">
                    <Image src={chwckwithshadow} alt="success" />
                </div>
                <h2 className="success-title">{title}</h2>
                <p className="success-message">{description}</p>
            </div>
        </div>
    )
}
