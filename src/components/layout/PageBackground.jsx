import { HERO_PHOTO } from "../../config/site";

// Fixed full-page photograph with a soft light wash so content stays readable.
export default function PageBackground() {
  return <div className="page-bg" style={{ backgroundImage: `url("${HERO_PHOTO}")` }} aria-hidden="true" />;
}
