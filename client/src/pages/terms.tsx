export default function TermsAndConditions() {
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-xl text-muted-foreground">
          Please read these terms carefully before using our car rental services
        </p>
      </div>

      {/* Terms Content */}
      <div className="prose prose-lg max-w-4xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Rental Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Minimum renter age is 21 years with a valid driver's license of at least 1 year.</li>
            <li>A valid government-issued photo ID is required for all rentals.</li>
            <li>The renter must be present at the time of vehicle pickup with original documents.</li>
            <li>Rental periods are calculated on a 24-hour basis from the time of pickup.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Booking and Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Advance booking is recommended to ensure vehicle availability.</li>
            <li>Payment can be made via credit/debit card or online banking.</li>
            <li>Special offers and discounts cannot be combined with other promotions.</li>
            <li>For '5+1 Day Free' offer, the rental period must be continuous.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Vehicle Usage</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Vehicles must be used only on proper roads and as per traffic rules.</li>
            <li>Smoking is strictly prohibited in all vehicles.</li>
            <li>Pets are not allowed in the vehicles unless specifically permitted.</li>
            <li>The vehicle should not be used for commercial purposes.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Insurance and Liability</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Basic insurance is included in the rental price.</li>
            <li>Additional insurance options are available for purchase.</li>
            <li>Renters are responsible for any damage due to negligence.</li>
            <li>Personal belongings are not covered under our insurance.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Fuel Policy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Vehicles are provided with a full tank of fuel.</li>
            <li>Return the vehicle with a full tank to avoid refueling charges.</li>
            <li>Use only the specified fuel type for the vehicle.</li>
            <li>Keep fuel receipts for verification if required.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cancellation Policy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Free cancellation up to 24 hours before pickup time.</li>
            <li>Cancellations within 24 hours may incur a charge.</li>
            <li>No-shows will be charged one day's rental fee.</li>
            <li>Refunds will be processed within 5-7 business days.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Extension and Returns</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Extensions must be requested and approved before the rental end time.</li>
            <li>Late returns will incur additional charges.</li>
            <li>Early returns do not qualify for partial refunds.</li>
            <li>Vehicle condition will be inspected upon return.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Additional Charges</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Traffic violations and fines are the renter's responsibility.</li>
            <li>Additional cleaning charges may apply if required.</li>
            <li>Interstate permits, if required, are charged extra.</li>
            <li>Toll charges are to be paid by the renter.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Emergency Support</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>24/7 roadside assistance is provided for all rentals.</li>
            <li>In case of accidents, inform FOXCARZ and local authorities immediately.</li>
            <li>Replacement vehicle subject to availability.</li>
            <li>Emergency contact numbers are provided with rental documents.</li>
          </ul>
        </section>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>Last updated: October 15, 2025</p>
          <p>For any queries regarding these terms, please contact our customer support.</p>
        </div>
      </div>
    </div>
  );
}