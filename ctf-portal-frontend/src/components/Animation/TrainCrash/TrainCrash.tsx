import gsap from "gsap";
import React, { RefObject, createRef } from "react";
import styles from "./TrainCrash.module.scss";

//components
import { Modal, Button } from "react-bootstrap";
import FlagCard from "../../FlagCard/FlagCard";
import confetti from "canvas-confetti";

//models
import Flag from "../../../models/Flag";
import FlagStatus from "../../../models/enums/FlagStatus";

class TrainCrash extends React.Component<
  { flags: Flag[] },
  { show: boolean; flag: number }
> {
  private tl = gsap.timeline({ duration: 0.5, ease: "ease" });

  private train: RefObject<SVGGElement>;
  private secondTrain: RefObject<SVGGElement>;
  private trainShadow: RefObject<SVGGElement>;
  private secondTrainShadow: RefObject<SVGGElement>;
  private track: RefObject<SVGGElement>;
  private arm: RefObject<SVGGElement>;
  private flagSixButton: RefObject<SVGGElement>;

  constructor(props: any) {
    super(props);
    this.train = createRef();
    this.secondTrain = createRef();
    this.trainShadow = createRef();
    this.secondTrainShadow = createRef();
    this.track = createRef();
    this.arm = createRef();
    this.flagSixButton = createRef();

    this.state = { show: false, flag: 1 };
  }

  componentDidMount(): void {
    this.animateTrain();
  }

  componentDidUpdate(props: { flags: Flag[] }): void {
    if (!props || !props.flags.length) return;

    const flagSix = 6;
    if (
      this.isFlagValid(flagSix) &&
      props.flags[flagSix - 1].status !== FlagStatus.Valid
    ) {
      this.closeFlagSubmitModal();
      this.runConfetti();
    }
  }

  isFlagValid(id: number): boolean {
    if (!this.props.flags.length) return false;
    return this.props.flags[id - 1].status === FlagStatus.Valid;
  }

  runConfetti() {
    const myCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!myCanvas) return;
    const myConfetti = confetti.create(myCanvas, {
      resize: true,
      useWorker: true,
    });
    myConfetti({
      particleCount: 500,
      spread: 160,
    });
  }

  animateTrain(): void {
    this.tl
      .to(this.train.current, {
        x: 0,
        ease: "linear",
        duration: 1,
      })
      .to(
        this.trainShadow.current,
        {
          x: 0,
          ease: "linear",
          duration: 1,
        },
        "<"
      )
      .to(
        this.secondTrain.current,
        {
          x: 0,
          ease: "linear",
          duration: 1,
        },
        "<"
      )
      .to(
        this.secondTrainShadow.current,
        {
          x: 0,
          ease: "linear",
          duration: 1,
        },
        "<"
      );
    this.tl.to(this.flagSixButton.current, {
      opacity: 1,
    });
  }

  getBackgroundColor(): string {
    if (!this.props.flags.length) return "";
    switch (this.props.flags[this.state.flag - 1].status) {
      case FlagStatus.Invalid:
      case FlagStatus.Errored:
        return "bg-red-500";
      case FlagStatus.Valid:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  }

  getFillColor(id: number): string {
    if (!this.props.flags.length) return "";
    switch (this.props.flags[id - 1].status) {
      case FlagStatus.Invalid:
      case FlagStatus.Errored:
        return "#ef4444";
      case FlagStatus.Valid:
        return "#10b981";
      default:
        return "#6b7280";
    }
  }

  openFlagSubmitModal(id: number): void {
    this.setState({ ...this.state, show: true, flag: id });
  }

  closeFlagSubmitModal(): void {
    this.setState({ ...this.state, show: false });
  }

  renderFlagSubmit() {
    return (
      <Modal
        contentClassName={`${this.getBackgroundColor()}`}
        show={this.state.show}
        onHide={() => this.setState({ ...this.state, show: false })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Submit flag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FlagCard flag={this.props.flags[this.state.flag - 1]} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => this.setState({ ...this.state, show: false })}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        <canvas
          id="canvas"
          className="z-10 fixed top-0 left-0 w-full h-full pointer-events-none"
        />
        {this.renderFlagSubmit()}
        <svg className={styles.background} viewBox="0 0 1920 1080">
          <g id="collision (6)" clip-path="url(#clip0_122_3315)">
            <rect width="1920" height="1080" fill="white" />
            <g id="sky">
              <rect
                id="skybox"
                width="1920"
                height="729"
                fill="url(#paint0_radial_122_3315)"
              />
              <g id="clouds&#38;sun">
                <path
                  id="Vector"
                  d="M382.094 157.88C422.03 157.88 454.404 125.506 454.404 85.57C454.404 45.6343 422.03 13.26 382.094 13.26C342.158 13.26 309.784 45.6343 309.784 85.57C309.784 125.506 342.158 157.88 382.094 157.88Z"
                  fill="#FCCC63"
                />
                <path
                  id="Vector_2"
                  d="M1010.07 29.3298H829.134C823.633 29.3298 819.174 33.7891 819.174 39.2898V41.0598C819.174 46.5606 823.633 51.0198 829.134 51.0198H1010.07C1015.57 51.0198 1020.03 46.5606 1020.03 41.0598V39.2898C1020.03 33.7891 1015.57 29.3298 1010.07 29.3298Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_3"
                  d="M1055.06 47.8098H874.124C868.623 47.8098 864.164 52.2691 864.164 57.7698V59.5398C864.164 65.0406 868.623 69.4998 874.124 69.4998H1055.06C1060.56 69.4998 1065.02 65.0406 1065.02 59.5398V57.7698C1065.02 52.2691 1060.56 47.8098 1055.06 47.8098Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_4"
                  d="M978.734 63.8799H797.794C792.293 63.8799 787.834 68.3391 787.834 73.8399V75.6099C787.834 81.1106 792.293 85.5699 797.794 85.5699H978.734C984.235 85.5699 988.694 81.1106 988.694 75.6099V73.8399C988.694 68.3391 984.235 63.8799 978.734 63.8799Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_5"
                  d="M666.194 277.6H485.254C479.753 277.6 475.294 282.059 475.294 287.56V289.33C475.294 294.831 479.753 299.29 485.254 299.29H666.194C671.695 299.29 676.154 294.831 676.154 289.33V287.56C676.154 282.059 671.695 277.6 666.194 277.6Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_6"
                  d="M1640.02 82.7646H1459.08C1453.58 82.7646 1449.12 87.2239 1449.12 92.7247V94.4947C1449.12 99.9954 1453.58 104.455 1459.08 104.455H1640.02C1645.52 104.455 1649.98 99.9954 1649.98 94.4947V92.7247C1649.98 87.2239 1645.52 82.7646 1640.02 82.7646Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_7"
                  d="M711.184 296.08H530.244C524.743 296.08 520.284 300.539 520.284 306.04V307.81C520.284 313.311 524.743 317.77 530.244 317.77H711.184C716.685 317.77 721.144 313.311 721.144 307.81V306.04C721.144 300.539 716.685 296.08 711.184 296.08Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_8"
                  d="M1685.01 101.245H1504.07C1498.57 101.245 1494.11 105.704 1494.11 111.205V112.975C1494.11 118.476 1498.57 122.935 1504.07 122.935H1685.01C1690.51 122.935 1694.97 118.476 1694.97 112.975V111.205C1694.97 105.704 1690.51 101.245 1685.01 101.245Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_9"
                  d="M634.854 312.14H453.914C448.413 312.14 443.954 316.599 443.954 322.1V323.87C443.954 329.371 448.413 333.83 453.914 333.83H634.854C640.355 333.83 644.814 329.371 644.814 323.87V322.1C644.814 316.599 640.355 312.14 634.854 312.14Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_10"
                  d="M1608.68 117.305H1427.74C1422.24 117.305 1417.78 121.764 1417.78 127.265V129.035C1417.78 134.535 1422.24 138.995 1427.74 138.995H1608.68C1614.18 138.995 1618.64 134.535 1618.64 129.035V127.265C1618.64 121.764 1614.18 117.305 1608.68 117.305Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_11"
                  d="M465.324 128.15H284.384C278.883 128.15 274.424 132.609 274.424 138.11V139.88C274.424 145.381 278.883 149.84 284.384 149.84H465.324C470.825 149.84 475.284 145.381 475.284 139.88V138.11C475.284 132.609 470.825 128.15 465.324 128.15Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_12"
                  d="M510.324 146.63H329.384C323.883 146.63 319.424 151.089 319.424 156.59V158.36C319.424 163.861 323.883 168.32 329.384 168.32H510.324C515.825 168.32 520.284 163.861 520.284 158.36V156.59C520.284 151.089 515.825 146.63 510.324 146.63Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <path
                  id="Vector_13"
                  d="M433.994 162.7H253.054C247.553 162.7 243.094 167.159 243.094 172.66V174.43C243.094 179.931 247.553 184.39 253.054 184.39H433.994C439.495 184.39 443.954 179.931 443.954 174.43V172.66C443.954 167.159 439.495 162.7 433.994 162.7Z"
                  fill="#F2F2F2"
                  fill-opacity="0.7"
                />
                <g id="Group" opacity="0.5">
                  <path
                    id="Vector_14"
                    opacity="0.5"
                    d="M382.094 166.72C426.912 166.72 463.244 130.388 463.244 85.5699C463.244 40.752 426.912 4.41992 382.094 4.41992C337.276 4.41992 300.944 40.752 300.944 85.5699C300.944 130.388 337.276 166.72 382.094 166.72Z"
                    fill="url(#paint1_linear_122_3315)"
                  />
                </g>
              </g>
            </g>
            <g id="background">
              <path
                id="hill_front"
                d="M1970.17 714.224C1981.53 713.087 1987.92 711.544 1987.92 709.936C1990.82 676.135 1919.53 661.268 1616.13 644.62C1462.86 639.517 1296.76 639.817 1145.44 645.471C877.462 655.517 -65 681.386 -65 711.714V711.757C-64.9967 712.883 -60.528 713.962 -52.5768 714.757C-44.6256 715.553 -33.8428 716 -22.5997 716H1927.33C1943.4 716 1958.81 715.361 1970.17 714.224Z"
                fill="#BEDD8C"
              />
              <g id="town">
                <path
                  id="Vector_15"
                  d="M1442.23 660.731C1441.23 661.252 1440.29 661.899 1439.45 662.657C1438.59 661.895 1437.64 661.248 1436.62 660.731C1435.61 661.252 1434.67 661.899 1433.83 662.657C1432.97 661.895 1432.02 661.248 1431 660.731C1431 660.731 1426.63 662.879 1426.64 665.503C1426.64 665.569 1426.65 665.634 1426.65 665.699C1426.8 667.417 1431.32 667.855 1433.8 667.045C1435.63 667.569 1437.58 667.569 1439.41 667.045C1441.88 667.868 1446.49 667.396 1446.62 665.659C1446.63 665.594 1446.63 665.528 1446.63 665.463C1446.62 662.839 1442.23 660.731 1442.23 660.731Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_16"
                  d="M863.874 570.464L860 567.366L881.69 548H936.69V565.042L901.056 589.056L863.874 570.464Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_17"
                  d="M946.718 558.863V548.387H939.416V550.952L936.69 548L918.873 567.366L911.902 572.014L901.091 650.992L917.394 667.295H955.282V568.141L946.718 558.863Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_18"
                  d="M918.873 567.366H860V667.295H918.873V567.366Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_19"
                  d="M893.697 642.893H882.852V667.295H893.697V642.893Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_20"
                  d="M871.233 649.865V645.992H866.585V649.865H870.845H871.233Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_21"
                  d="M870.845 652.964H866.585V656.838H871.233V652.964H870.845Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_22"
                  d="M878.979 645.992H874.331V649.865H878.979V645.992Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_23"
                  d="M878.979 652.964H874.331V656.837H878.979V652.964Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_24"
                  d="M902.993 649.865V645.992H898.345V649.865H902.605H902.993Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_25"
                  d="M902.605 652.964H898.345V656.838H902.993V652.964H902.605Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_26"
                  d="M910.739 645.992H906.091V649.865H910.739V645.992Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_27"
                  d="M910.739 652.964H906.091V656.837H910.739V652.964Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_28"
                  d="M911.514 572.401H866.585V581.697H911.514V572.401Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_29"
                  d="M911.514 590.992H866.585V600.288H911.514V590.992Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_30"
                  d="M911.514 609.584H866.585V618.88H911.514V609.584Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_31"
                  d="M911.514 628.175H866.585V637.471H911.514V628.175Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_32"
                  d="M952.007 661.293C951 661.814 950.064 662.461 949.221 663.219C948.364 662.457 947.412 661.81 946.389 661.293C945.383 661.814 944.446 662.461 943.604 663.219C942.747 662.457 941.795 661.81 940.772 661.293C940.772 661.293 936.406 663.441 936.418 666.065C936.418 666.13 936.421 666.196 936.427 666.261C936.576 667.979 941.09 668.417 943.57 667.607C945.406 668.13 947.352 668.13 949.187 667.607C951.657 668.429 956.263 667.958 956.397 666.22C956.402 666.155 956.405 666.09 956.405 666.024C956.393 663.4 952.007 661.293 952.007 661.293Z"
                  fill="#6C63FF"
                />
                <path
                  id="Vector_33"
                  d="M931.841 570.464L927.967 567.366L949.657 548H1004.66V565.042L969.024 589.056L931.841 570.464Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_34"
                  d="M1014.69 558.863V548.387H1007.38V550.952L1004.66 548L986.841 567.366L979.869 572.014L969.059 650.992L985.361 667.295H1023.25V568.141L1014.69 558.863Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_35"
                  d="M986.84 567.366H927.967V667.295H986.84V567.366Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_36"
                  d="M961.664 642.893H950.819V667.295H961.664V642.893Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_37"
                  d="M939.2 649.865V645.992H934.552V649.865H938.812H939.2Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_38"
                  d="M938.812 652.964H934.552V656.838H939.2V652.964H938.812Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_39"
                  d="M946.946 645.992H942.298V649.865H946.946V645.992Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_40"
                  d="M946.946 652.964H942.298V656.837H946.946V652.964Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_41"
                  d="M970.96 649.865V645.992H966.312V649.865H970.573H970.96Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_42"
                  d="M970.573 652.964H966.312V656.838H970.96V652.964H970.573Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_43"
                  d="M978.706 645.992H974.059V649.865H978.706V645.992Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_44"
                  d="M978.706 652.964H974.059V656.837H978.706V652.964Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_45"
                  d="M1003.5 572.401V568.527H998.847V572.401H1003.11H1003.5Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_46"
                  d="M1003.11 575.5H998.847V579.373H1003.5V575.5H1003.11Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_47"
                  d="M1011.24 568.528H1006.59V572.401H1011.24V568.528Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_48"
                  d="M1011.24 575.499H1006.59V579.372H1011.24V575.499Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_49"
                  d="M1003.5 594.091V590.218H998.847V594.091H1003.11H1003.5Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_50"
                  d="M1003.11 597.189H998.847V601.062H1003.5V597.189H1003.11Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_51"
                  d="M1011.24 590.218H1006.59V594.091H1011.24V590.218Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_52"
                  d="M1011.24 597.189H1006.59V601.063H1011.24V597.189Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_53"
                  d="M1003.5 615.781V611.908H998.847V615.781H1003.11H1003.5Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_54"
                  d="M1003.11 618.88H998.847V622.753H1003.5V618.88H1003.11Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_55"
                  d="M1011.24 611.907H1006.59V615.781H1011.24V611.907Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_56"
                  d="M1011.24 618.879H1006.59V622.753H1011.24V618.879Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_57"
                  d="M1003.5 637.471V633.598H998.847V637.471H1003.11H1003.5Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_58"
                  d="M1003.11 640.57H998.847V644.443H1003.5V640.57H1003.11Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_59"
                  d="M1011.24 633.598H1006.59V637.471H1011.24V633.598Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_60"
                  d="M1011.24 640.57H1006.59V644.443H1011.24V640.57Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_61"
                  d="M979.481 572.401H934.552V581.697H979.481V572.401Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_62"
                  d="M979.481 590.992H934.552V600.288H979.481V590.992Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_63"
                  d="M979.481 609.584H934.552V618.88H979.481V609.584Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_64"
                  d="M979.481 628.175H934.552V637.471H979.481V628.175Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_65"
                  d="M1064.23 592.855H1062.35V666.943H1064.23V592.855Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_66"
                  d="M1082.53 614.417C1082.53 615.232 1082.53 616.043 1082.51 616.851C1081.84 646.015 1046.87 646.177 1045.93 617.019C1045.9 616.212 1045.89 615.401 1045.88 614.586C1045.73 581.986 1063.94 555.474 1063.94 555.474C1063.94 555.474 1082.38 581.817 1082.53 614.417Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_67"
                  d="M1057.7 661.129C1056.7 661.649 1055.76 662.296 1054.92 663.054C1054.06 662.293 1053.11 661.646 1052.09 661.129C1051.08 661.649 1050.14 662.296 1049.3 663.054C1048.44 662.293 1047.49 661.646 1046.47 661.129C1046.47 661.129 1042.1 663.276 1042.12 665.901C1042.12 665.966 1042.12 666.031 1042.12 666.096C1042.27 667.814 1046.79 668.252 1049.27 667.443C1051.1 667.966 1053.05 667.966 1054.89 667.443C1057.35 668.265 1061.96 667.794 1062.1 666.056C1062.1 665.991 1062.1 665.926 1062.1 665.86C1062.09 663.236 1057.7 661.129 1057.7 661.129Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_68"
                  d="M1110.19 635.534L1107.86 631.661L1129.55 596.219H1185.33V601.641L1165.19 640.182L1141.95 644.83L1110.19 635.534Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_69"
                  d="M1194.93 623.98V595.008H1187.63V598.83L1185.33 596.218L1166.74 631.661L1163.64 634.76L1159.76 650.252L1166.74 667.294H1202.37V632.435L1194.93 623.98Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_70"
                  d="M1166.74 631.661H1107.86V667.295H1166.74V631.661Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_71"
                  d="M1158.6 642.893H1146.21V653.738H1158.6V642.893Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_72"
                  d="M1141.17 642.506H1130.33V667.295H1141.17V642.506Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_73"
                  d="M1117.93 646.379V642.506H1113.29V646.379H1117.55H1117.93Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_74"
                  d="M1117.55 649.478H1113.29V653.351H1117.93V649.478H1117.55Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_75"
                  d="M1125.68 642.506H1121.03V646.379H1125.68V642.506Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_76"
                  d="M1125.68 649.478H1121.03V653.351H1125.68V649.478Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_77"
                  d="M1134.56 610.786L1133.95 609.767L1139.66 600.442H1154.33V601.868L1149.03 612.009L1142.92 613.232L1134.56 610.786Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_78"
                  d="M1154.33 600.442L1149.44 609.767L1148.63 610.582L1147.61 614.659L1149.44 619.142H1158.82V609.971L1154.33 600.442Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_79"
                  d="M1149.44 609.767H1133.95V619.142H1149.44V609.767Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_80"
                  d="M1140.51 613.807V611.958H1138.29V613.807H1140.33H1140.51Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_81"
                  d="M1140.33 615.287H1138.29V617.136H1140.51V615.287H1140.33Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_82"
                  d="M1144.21 611.958H1141.99V613.807H1144.21V611.958Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_83"
                  d="M1144.21 615.286H1141.99V617.136H1144.21V615.286Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_84"
                  d="M1180.4 635.534L1178.08 631.661L1199.77 596.219H1255.54V601.641L1235.4 640.182L1212.16 644.83L1180.4 635.534Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_85"
                  d="M1265.14 623.98V595.008H1257.84V598.83L1255.54 596.218L1236.95 631.661L1233.85 634.76L1229.98 650.252L1236.95 667.294H1272.58V632.435L1265.14 623.98Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_86"
                  d="M1236.95 631.661H1178.08V667.295H1236.95V631.661Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_87"
                  d="M1228.82 642.893H1216.42V653.738H1228.82V642.893Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_88"
                  d="M1211.39 642.506H1200.54V667.295H1211.39V642.506Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_89"
                  d="M1188.15 646.38V642.506H1183.5V646.38H1187.76H1188.15Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_90"
                  d="M1187.76 649.478H1183.5V653.351H1188.15V649.478H1187.76Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_91"
                  d="M1195.89 642.506H1191.25V646.379H1195.89V642.506Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_92"
                  d="M1195.89 649.478H1191.25V653.351H1195.89V649.478Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_93"
                  d="M1248.37 635.534L1246.04 631.661L1267.73 596.219H1323.51V601.641L1303.37 640.182L1280.13 644.83L1248.37 635.534Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_94"
                  d="M1333.11 623.98V595.008H1325.81V598.83L1323.51 596.218L1304.92 631.661L1301.82 634.76L1297.94 650.252L1304.92 667.294H1340.55V632.435L1333.11 623.98Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_95"
                  d="M1304.92 631.661H1246.04V667.295H1304.92V631.661Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_96"
                  d="M1296.78 642.893H1284.39V653.738H1296.78V642.893Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_97"
                  d="M1279.35 642.506H1268.51V667.295H1279.35V642.506Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_98"
                  d="M1256.11 646.38V642.506H1251.47V646.38H1255.73H1256.11Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_99"
                  d="M1255.73 649.478H1251.47V653.351H1256.11V649.478H1255.73Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_100"
                  d="M1263.86 642.506H1259.21V646.379H1263.86V642.506Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_101"
                  d="M1263.86 649.478H1259.21V653.351H1263.86V649.478Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_102"
                  d="M1203.09 611.348L1202.48 610.328L1208.19 601.003H1222.86V602.43L1217.56 612.571L1211.45 613.793L1203.09 611.348Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_103"
                  d="M1222.86 601.003L1217.97 610.328L1217.16 611.144L1216.14 615.22L1217.97 619.704H1227.35V610.533L1222.86 601.003Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_104"
                  d="M1217.97 610.329H1202.48V619.704H1217.97V610.329Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_105"
                  d="M1209.04 614.369V612.519H1206.82V614.369H1208.86H1209.04Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_106"
                  d="M1208.86 615.848H1206.82V617.698H1209.04V615.848H1208.86Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_107"
                  d="M1212.74 612.52H1210.52V614.369H1212.74V612.52Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_108"
                  d="M1212.74 615.848H1210.52V617.697H1212.74V615.848Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_109"
                  d="M1271.62 610.786L1271.01 609.767L1276.72 600.442H1291.39V601.868L1286.09 612.009L1279.98 613.232L1271.62 610.786Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_110"
                  d="M1291.39 600.442L1286.5 609.767L1285.68 610.582L1284.67 614.659L1286.5 619.142H1295.88V609.971L1291.39 600.442Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_111"
                  d="M1286.5 609.767H1271.01V619.142H1286.5V609.767Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_112"
                  d="M1277.57 613.807V611.958H1275.35V613.807H1277.39H1277.57Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_113"
                  d="M1277.39 615.287H1275.35V617.136H1277.57V615.287H1277.39Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_114"
                  d="M1281.27 611.958H1279.05V613.807H1281.27V611.958Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_115"
                  d="M1281.27 615.286H1279.05V617.136H1281.27V615.286Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_116"
                  d="M1318.58 635.534L1316.26 631.661L1337.95 596.219H1393.72V601.641L1373.58 640.182L1350.34 644.83L1318.58 635.534Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_117"
                  d="M1403.32 601.19V595.008H1396.02V598.83L1393.72 596.218L1375.13 631.661L1372.03 634.76L1368.16 650.252L1375.13 667.294H1410.76V632.435L1403.32 601.19Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_118"
                  d="M1375.13 631.661H1316.26V667.295H1375.13V631.661Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_119"
                  d="M1367 642.893H1354.6V653.738H1367V642.893Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_120"
                  d="M1349.57 642.506H1338.72V667.295H1349.57V642.506Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_121"
                  d="M1326.33 646.38V642.506H1321.68V646.38H1325.94H1326.33Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_122"
                  d="M1325.94 649.478H1321.68V653.351H1326.33V649.478H1325.94Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_123"
                  d="M1334.07 642.506H1329.43V646.379H1334.07V642.506Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_124"
                  d="M1334.07 649.478H1329.43V653.351H1334.07V649.478Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_125"
                  d="M1391.79 646.767V642.893H1387.14V646.767H1391.4H1391.79Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_126"
                  d="M1391.4 649.865H1387.14V653.739H1391.79V649.865H1391.4Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_127"
                  d="M1399.53 642.893H1394.88V646.767H1399.53V642.893Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_128"
                  d="M1399.53 649.865H1394.88V653.738H1399.53V649.865Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_129"
                  d="M1340.15 611.348L1339.54 610.328L1345.24 601.003H1359.92V602.43L1354.62 612.571L1348.51 613.793L1340.15 611.348Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_130"
                  d="M1359.92 601.003L1355.03 610.328L1354.21 611.144L1353.19 615.22L1355.03 619.704H1364.4V610.533L1359.92 601.003Z"
                  fill="#CCCCCC"
                />
                <path
                  id="Vector_131"
                  d="M1355.03 610.329H1339.54V619.704H1355.03V610.329Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_132"
                  d="M1346.1 614.369V612.519H1343.88V614.369H1345.92H1346.1Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_133"
                  d="M1345.92 615.848H1343.88V617.698H1346.1V615.848H1345.92Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_134"
                  d="M1349.8 612.52H1347.58V614.369H1349.8V612.52Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_135"
                  d="M1349.8 615.848H1347.58V617.697H1349.8V615.848Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_136"
                  d="M1436.93 592.844H1435.06V666.91H1436.93V592.844Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_137"
                  d="M1455.23 614.4C1455.23 615.214 1455.23 616.025 1455.21 616.832C1454.53 645.988 1419.58 646.149 1418.64 617.001C1418.61 616.194 1418.6 615.383 1418.59 614.569C1418.44 581.978 1436.64 555.474 1436.64 555.474C1436.64 555.474 1455.08 581.809 1455.23 614.4Z"
                  fill="#9AB967"
                />
              </g>
            </g>
            <rect
              id="grass"
              y="820"
              width="1920"
              height="260"
              fill="url(#paint2_linear_122_3315)"
            />
            <g id="track">
              <rect
                id="background_2"
                x="135.983"
                y="1082.21"
                width="849.959"
                height="104"
                transform="rotate(-25 135.983 1082.21)"
                fill="url(#paint3_linear_122_3315)"
              />
              <rect
                id="background_3"
                y="716"
                width="1920"
                height="104"
                fill="url(#paint4_linear_122_3315)"
              />
              <g id="sleepers">
                <g id="sleeper">
                  <path
                    id="Rectangle 14"
                    d="M1686.87 723.497H1707.64L1711 797.216H1683.11L1686.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13"
                    d="M1684.76 722.216H1705.53L1708.89 795.935H1681L1684.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_2">
                  <path
                    id="Rectangle 14_2"
                    d="M1398.87 723.497H1419.64L1423 797.216H1395.11L1398.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_2"
                    d="M1396.76 722.216H1417.53L1420.89 795.935H1393L1396.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_3">
                  <path
                    id="Rectangle 14_3"
                    d="M1110.87 723.497H1131.64L1135 797.216H1107.11L1110.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_3"
                    d="M1108.76 722.216H1129.53L1132.89 795.935H1105L1108.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_4">
                  <path
                    id="Rectangle 14_4"
                    d="M822.87 723.497H843.641L845 779H820.5L822.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_4"
                    d="M820.757 722.216H841.529L842.5 775H818L820.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_5">
                  <path
                    id="Rectangle 14_5"
                    d="M534.87 723.497H555.641L559 797.216H531.112L534.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_5"
                    d="M532.757 722.216H553.529L556.888 795.935H529L532.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_6">
                  <path
                    id="Rectangle 14_6"
                    d="M246.87 723.497H267.641L271 797.216H243.112L246.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_6"
                    d="M244.757 722.216H265.529L268.888 795.935H241L244.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_7">
                  <path
                    id="Rectangle 14_7"
                    d="M1830.87 723.497H1851.64L1855 797.216H1827.11L1830.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_7"
                    d="M1828.76 722.216H1849.53L1852.89 795.935H1825L1828.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_8">
                  <path
                    id="Rectangle 14_8"
                    d="M1542.87 723.497H1563.64L1567 797.216H1539.11L1542.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_8"
                    d="M1540.76 722.216H1561.53L1564.89 795.935H1537L1540.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_9">
                  <path
                    id="Rectangle 14_9"
                    d="M1254.87 723.497H1275.64L1279 797.216H1251.11L1254.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_9"
                    d="M1252.76 722.216H1273.53L1276.89 795.935H1249L1252.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_10">
                  <path
                    id="Rectangle 14_10"
                    d="M966.87 723.497H987.641L991 797.216H963.112L966.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_10"
                    d="M964.757 722.216H985.529L988.888 795.935H961L964.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_11">
                  <path
                    id="Rectangle 14_11"
                    d="M894.87 723.92H915.641L919 822H891.112L894.87 723.92Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_11"
                    d="M892.757 722.216H913.529L916.888 820.296H889L892.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_12">
                  <path
                    id="Rectangle 14_12"
                    d="M678.87 723.497H699.641L703 797.216H675.112L678.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_12"
                    d="M676.757 722.216H697.529L700.888 795.935H673L676.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_13">
                  <path
                    id="Rectangle 14_13"
                    d="M390.87 723.497H411.641L415 797.216H387.112L390.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_13"
                    d="M388.757 722.216H409.529L412.888 795.935H385L388.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_14">
                  <path
                    id="Rectangle 14_14"
                    d="M102.87 723.497H123.641L127 797.216H99.1123L102.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_14"
                    d="M100.757 722.216H121.529L124.888 795.935H97L100.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_15">
                  <path
                    id="Rectangle 14_15"
                    d="M1902.87 723.497H1923.64L1927 797.216H1899.11L1902.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_15"
                    d="M1900.76 722.216H1921.53L1924.89 795.935H1897L1900.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_16">
                  <path
                    id="Rectangle 14_16"
                    d="M1614.87 723.497H1635.64L1639 797.216H1611.11L1614.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_16"
                    d="M1612.76 722.216H1633.53L1636.89 795.935H1609L1612.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_17">
                  <path
                    id="Rectangle 14_17"
                    d="M1326.87 723.497H1347.64L1351 797.216H1323.11L1326.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_17"
                    d="M1324.76 722.216H1345.53L1348.89 795.935H1321L1324.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_18">
                  <path
                    id="Rectangle 14_18"
                    d="M1038.87 723.497H1059.64L1063 797.216H1035.11L1038.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_18"
                    d="M1036.76 722.216H1057.53L1060.89 795.935H1033L1036.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_19">
                  <path
                    id="Rectangle 14_19"
                    d="M750.87 723.497H771.641L775 797.216H747.112L750.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_19"
                    d="M748.757 722.216H769.529L772.888 795.935H745L748.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_20">
                  <path
                    id="Rectangle 14_20"
                    d="M462.87 723.497H483.641L487 797.216H459.112L462.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_20"
                    d="M460.757 722.216H481.529L484.888 795.935H457L460.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_21">
                  <path
                    id="Rectangle 14_21"
                    d="M174.87 723.497H195.641L199 797.216H171.112L174.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_21"
                    d="M172.757 722.216H193.529L196.888 795.935H169L172.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_22">
                  <path
                    id="Rectangle 14_22"
                    d="M1758.87 723.497H1779.64L1783 797.216H1755.11L1758.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_22"
                    d="M1756.76 722.216H1777.53L1780.89 795.935H1753L1756.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_23">
                  <path
                    id="Rectangle 14_23"
                    d="M1470.87 723.497H1491.64L1495 797.216H1467.11L1470.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_23"
                    d="M1468.76 722.216H1489.53L1492.89 795.935H1465L1468.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_24">
                  <path
                    id="Rectangle 14_24"
                    d="M1182.87 723.497H1203.64L1207 797.216H1179.11L1182.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_24"
                    d="M1180.76 722.216H1201.53L1204.89 795.935H1177L1180.76 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_25">
                  <path
                    id="Rectangle 14_25"
                    d="M606.87 723.497H627.641L631 797.216H603.112L606.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_25"
                    d="M604.757 722.216H625.529L628.888 795.935H601L604.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_26">
                  <path
                    id="Rectangle 14_26"
                    d="M318.87 723.497H339.641L343 797.216H315.112L318.87 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_26"
                    d="M316.757 722.216H337.529L340.888 795.935H313L316.757 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_27">
                  <path
                    id="Rectangle 14_27"
                    d="M30.8697 723.497H51.6412L55 797.216H27.1123L30.8697 723.497Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_27"
                    d="M28.7574 722.216H49.5289L52.8877 795.935H25L28.7574 722.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_28">
                  <path
                    id="Rectangle 14_28"
                    d="M727.177 820.466L746.002 811.688L780.201 877.081L754.927 888.866L727.177 820.466Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_28"
                    d="M727.721 818.198L746.546 809.42L780.746 874.812L755.471 886.598L727.721 818.198Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_29">
                  <path
                    id="Rectangle 14_29"
                    d="M664.177 850.466L683.002 841.688L717.201 907.081L691.927 918.866L664.177 850.466Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_29"
                    d="M664.721 848.198L683.546 839.42L717.746 904.812L692.471 916.598L664.721 848.198Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_30">
                  <path
                    id="Rectangle 14_30"
                    d="M790.177 793.466L809.002 784.688L843.201 850.081L817.927 861.866L790.177 793.466Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_30"
                    d="M790.721 791.198L809.546 782.42L843.746 847.812L818.471 859.598L790.721 791.198Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_31">
                  <path
                    id="Rectangle 14_31"
                    d="M606.177 876.466L625.002 867.688L659.201 933.081L633.927 944.866L606.177 876.466Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_31"
                    d="M606.721 874.198L625.546 865.42L659.746 930.812L634.471 942.598L606.721 874.198Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_32">
                  <path
                    id="Rectangle 14_32"
                    d="M542.177 904.466L561.002 895.688L595.201 961.081L569.927 972.866L542.177 904.466Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_32"
                    d="M542.721 902.198L561.546 893.42L595.746 958.812L570.471 970.598L542.721 902.198Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_33">
                  <path
                    id="Rectangle 14_33"
                    d="M478.177 934.466L497.002 925.688L531.201 991.081L505.927 1002.87L478.177 934.466Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_33"
                    d="M478.721 932.198L497.546 923.42L531.746 988.812L506.471 1000.6L478.721 932.198Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_34">
                  <path
                    id="Rectangle 14_34"
                    d="M418.177 961.466L437.002 952.688L471.201 1018.08L445.927 1029.87L418.177 961.466Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_34"
                    d="M418.721 959.198L437.546 950.42L471.746 1015.81L446.471 1027.6L418.721 959.198Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_35">
                  <path
                    id="Rectangle 14_35"
                    d="M353.177 994.466L372.002 985.688L406.201 1051.08L380.927 1062.87L353.177 994.466Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_35"
                    d="M353.721 992.198L372.546 983.42L406.746 1048.81L381.471 1060.6L353.721 992.198Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_36">
                  <path
                    id="Rectangle 14_36"
                    d="M290.177 1024.47L309.002 1015.69L343.201 1081.08L317.927 1092.87L290.177 1024.47Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_36"
                    d="M290.721 1022.2L309.546 1013.42L343.746 1078.81L318.471 1090.6L290.721 1022.2Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_37">
                  <path
                    id="Rectangle 14_37"
                    d="M227.177 1051.47L246.002 1042.69L280.201 1108.08L254.927 1119.87L227.177 1051.47Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                  <path
                    id="Rectangle 13_37"
                    d="M227.721 1049.2L246.546 1040.42L280.746 1105.81L255.471 1117.6L227.721 1049.2Z"
                    fill="#461D23"
                  />
                </g>
              </g>
              <g id="track_2">
                <g id="track_3">
                  <rect
                    id="Rectangle 12"
                    x="188.919"
                    y="1080.05"
                    width="734.547"
                    height="12"
                    transform="rotate(-25 188.919 1080.05)"
                    fill="#C4C4C4"
                  />
                  <rect
                    id="Rectangle 13_38"
                    x="190.44"
                    y="1083.31"
                    width="734.547"
                    height="8"
                    transform="rotate(-25 190.44 1083.31)"
                    fill="black"
                    fill-opacity="0.5"
                  />
                </g>
                <g id="track_4">
                  <rect
                    id="Rectangle 10"
                    x="278.411"
                    y="1079.79"
                    width="742.479"
                    height="15"
                    transform="rotate(-25 278.411 1079.79)"
                    fill="#C4C4C4"
                  />
                  <rect
                    id="Rectangle 14_38"
                    x="280.524"
                    y="1084.32"
                    width="742.479"
                    height="10"
                    transform="rotate(-25 280.524 1084.32)"
                    fill="black"
                    fill-opacity="0.5"
                  />
                </g>
              </g>
              <g id="track_5">
                <g id="track_6">
                  <rect
                    id="Rectangle 12_2"
                    y="731.833"
                    width="1920"
                    height="12"
                    fill="#C4C4C4"
                  />
                  <rect
                    id="Rectangle 13_39"
                    y="735.433"
                    width="1920"
                    height="8"
                    fill="black"
                    fill-opacity="0.5"
                  />
                </g>
                <g id="track_7">
                  <rect
                    id="Rectangle 10_2"
                    x="319.859"
                    y="766.363"
                    width="1600.14"
                    height="15"
                    fill="#C4C4C4"
                  />
                  <rect
                    id="Rectangle 14_39"
                    x="319.859"
                    y="771.363"
                    width="1600.14"
                    height="10"
                    fill="black"
                    fill-opacity="0.5"
                  />
                </g>
              </g>
              <g id="track_8">
                <rect
                  id="Rectangle 10_3"
                  x="-6"
                  y="766.4"
                  width="866"
                  height="15"
                  fill="#C4C4C4"
                />
                <rect
                  id="Rectangle 14_40"
                  x="-6"
                  y="771"
                  width="866"
                  height="10"
                  fill="black"
                  fill-opacity="0.5"
                />
              </g>
              <g
                ref={this.track}
                className={this.isFlagValid(6) ? styles.track : ""}
                id="switch_track"
              >
                <rect
                  id="Rectangle 10_4"
                  x="850.185"
                  y="735"
                  width="85.0691"
                  height="15"
                  fill="#C4C4C4"
                />
                <rect
                  id="Rectangle 14_41"
                  x="850.185"
                  y="739.6"
                  width="85.0691"
                  height="10"
                  fill="black"
                  fill-opacity="0.5"
                />
              </g>
            </g>
            <g id="switch">
              <g
                ref={this.arm}
                className={this.isFlagValid(6) ? styles.arm : ""}
                id="arm"
              >
                <path
                  id="Vector_138"
                  d="M1028.2 884.616C1049.76 863.063 1038.89 855.718 1019.1 875.512L954 940.61L963.193 949.803L1028.2 884.616Z"
                  fill="#ECF0F1"
                  stroke="black"
                />
                <path
                  id="Vector_139"
                  d="M1035.67 871.996C1036.36 871.996 1036.99 872.275 1037.44 872.728L1033.17 876.995L1021.53 876.995C1020.84 876.995 1020.21 876.716 1019.76 876.263L1024.03 871.996L1035.67 871.996Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_140"
                  d="M1021.53 886.138C1022.22 886.138 1022.84 886.417 1023.3 886.87L1019.03 891.137L1007.39 891.137C1006.7 891.137 1006.07 890.858 1005.62 890.406L1009.89 886.138L1021.53 886.138Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_141"
                  d="M1007.39 900.28C1008.08 900.28 1008.7 900.56 1009.15 901.012L1004.89 905.28L993.244 905.28C992.555 905.28 991.929 905 991.477 904.548L995.744 900.28L1007.39 900.28Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_142"
                  d="M993.244 914.422C993.933 914.422 994.559 914.702 995.012 915.154L990.744 919.422L979.102 919.422C978.413 919.422 977.787 919.142 977.334 918.69L981.602 914.422L993.244 914.422Z"
                  fill="#C03A2B"
                />
              </g>
              <g id="base">
                <path
                  id="Vector_143"
                  d="M988.001 969.245H938.001V957.887H942.849V932.403C942.849 918.5 954.001 913 962.001 913C972.001 913 981.907 920.805 981.907 932.403V957.887H988.001V969.245Z"
                  fill="#95A5A5"
                />
                <path
                  id="Vector_144"
                  d="M954.206 937.403L962.516 932.832L970.688 937.403V946.682L962.516 951.115L954.206 946.682V937.403Z"
                  fill="#43433E"
                />
                <rect
                  id="base_2"
                  x="938.001"
                  y="957"
                  width="50"
                  height="12"
                  fill="#95A5A5"
                />
              </g>
              <g
                ref={this.flagSixButton}
                className={styles.flag_button}
                onClick={() => this.openFlagSubmitModal(6)}
                id="submit_flag_6"
              >
                <rect
                  id="Rectangle 27"
                  x="976"
                  y="939"
                  width="135"
                  height="47.581"
                  rx="9"
                  fill={`${this.getFillColor(6)}`}
                  stroke="white"
                  stroke-width="2"
                />
                <path
                  id="Vector_145"
                  d="M1011.66 966.216H1009.62C1009.35 966.216 1009.09 966.323 1008.9 966.514C1008.7 966.705 1008.6 966.965 1008.6 967.235V974.37H988.211V953.983H997.385C997.655 953.983 997.914 953.876 998.106 953.685C998.297 953.494 998.404 953.234 998.404 952.964V950.925C998.404 950.655 998.297 950.396 998.106 950.205C997.914 950.013 997.655 949.906 997.385 949.906H987.191C986.38 949.906 985.602 950.228 985.029 950.802C984.455 951.375 984.133 952.153 984.133 952.964V975.39C984.133 976.201 984.455 976.978 985.029 977.552C985.602 978.125 986.38 978.448 987.191 978.448H1009.62C1010.43 978.448 1011.21 978.125 1011.78 977.552C1012.35 976.978 1012.67 976.201 1012.67 975.39V967.235C1012.67 966.965 1012.57 966.705 1012.38 966.514C1012.19 966.323 1011.93 966.216 1011.66 966.216ZM1015.22 945.829H1007.07C1005.71 945.829 1005.03 947.479 1005.99 948.441L1008.26 950.717L992.734 966.239C992.591 966.381 992.478 966.55 992.401 966.736C992.324 966.922 992.284 967.121 992.284 967.322C992.284 967.523 992.324 967.723 992.401 967.909C992.478 968.094 992.591 968.263 992.734 968.405L994.178 969.847C994.32 969.989 994.489 970.103 994.675 970.18C994.861 970.257 995.06 970.297 995.261 970.297C995.463 970.297 995.662 970.257 995.848 970.18C996.034 970.103 996.202 969.989 996.344 969.847L1011.86 954.322L1014.14 956.595C1015.1 957.551 1016.75 956.882 1016.75 955.512V947.358C1016.75 946.952 1016.59 946.563 1016.3 946.276C1016.02 945.99 1015.63 945.829 1015.22 945.829V945.829Z"
                  fill="white"
                />
                <path
                  id="Flag 6"
                  d="M1042.57 964.884H1035.26V972.438H1031.45V953.954H1043.49V957.039H1035.26V961.812H1042.57V964.884ZM1049.33 972.438H1045.64V952.938H1049.33V972.438ZM1060.32 972.438C1060.15 972.108 1060.03 971.697 1059.95 971.207C1059.06 972.197 1057.91 972.692 1056.49 972.692C1055.14 972.692 1054.02 972.303 1053.13 971.524C1052.25 970.745 1051.81 969.764 1051.81 968.579C1051.81 967.123 1052.35 966.006 1053.43 965.227C1054.51 964.448 1056.07 964.055 1058.11 964.046H1059.8V963.259C1059.8 962.625 1059.63 962.117 1059.3 961.736C1058.98 961.355 1058.47 961.165 1057.77 961.165C1057.15 961.165 1056.66 961.313 1056.31 961.609C1055.96 961.905 1055.79 962.311 1055.79 962.828H1052.12C1052.12 962.032 1052.36 961.296 1052.85 960.619C1053.35 959.942 1054.04 959.413 1054.94 959.032C1055.83 958.642 1056.84 958.448 1057.96 958.448C1059.65 958.448 1060.99 958.875 1061.98 959.73C1062.98 960.576 1063.48 961.77 1063.48 963.31V969.264C1063.49 970.568 1063.67 971.554 1064.03 972.222V972.438H1060.32ZM1057.29 969.886C1057.83 969.886 1058.33 969.768 1058.78 969.531C1059.24 969.285 1059.58 968.959 1059.8 968.553V966.192H1058.43C1056.59 966.192 1055.61 966.827 1055.5 968.096L1055.48 968.312C1055.48 968.769 1055.64 969.146 1055.96 969.442C1056.29 969.738 1056.73 969.886 1057.29 969.886ZM1065.77 965.468C1065.77 963.361 1066.26 961.664 1067.26 960.377C1068.27 959.091 1069.62 958.448 1071.33 958.448C1072.83 958.448 1074 958.964 1074.84 959.997L1075 958.702H1078.32V971.981C1078.32 973.183 1078.05 974.228 1077.5 975.117C1076.95 976.005 1076.19 976.682 1075.2 977.148C1074.21 977.613 1073.05 977.846 1071.72 977.846C1070.71 977.846 1069.73 977.643 1068.77 977.237C1067.82 976.839 1067.09 976.323 1066.6 975.688L1068.23 973.454C1069.14 974.478 1070.25 974.99 1071.55 974.99C1072.53 974.99 1073.29 974.727 1073.83 974.203C1074.37 973.686 1074.64 972.95 1074.64 971.994V971.257C1073.79 972.214 1072.68 972.692 1071.3 972.692C1069.65 972.692 1068.31 972.049 1067.29 970.762C1066.27 969.467 1065.77 967.753 1065.77 965.621V965.468ZM1069.43 965.735C1069.43 966.979 1069.68 967.957 1070.18 968.667C1070.68 969.37 1071.37 969.721 1072.24 969.721C1073.36 969.721 1074.16 969.302 1074.64 968.464V962.688C1074.15 961.85 1073.36 961.431 1072.27 961.431C1071.39 961.431 1070.69 961.791 1070.18 962.51C1069.68 963.23 1069.43 964.305 1069.43 965.735ZM1097.43 953.763V956.785H1097.07C1095.41 956.81 1094.08 957.242 1093.06 958.08C1092.05 958.917 1091.45 960.081 1091.25 961.571C1092.23 960.572 1093.47 960.073 1094.96 960.073C1096.57 960.073 1097.85 960.648 1098.8 961.799C1099.75 962.95 1100.22 964.465 1100.22 966.344C1100.22 967.546 1099.96 968.634 1099.43 969.607C1098.92 970.58 1098.18 971.338 1097.22 971.879C1096.28 972.421 1095.2 972.692 1094 972.692C1092.05 972.692 1090.48 972.015 1089.28 970.661C1088.08 969.306 1087.49 967.5 1087.49 965.24V963.919C1087.49 961.914 1087.86 960.145 1088.62 958.613C1089.38 957.072 1090.47 955.883 1091.88 955.045C1093.3 954.199 1094.95 953.772 1096.82 953.763H1097.43ZM1093.85 963.018C1093.26 963.018 1092.72 963.175 1092.24 963.488C1091.75 963.792 1091.4 964.199 1091.17 964.707V965.824C1091.17 967.051 1091.41 968.012 1091.89 968.706C1092.38 969.391 1093.05 969.734 1093.92 969.734C1094.71 969.734 1095.35 969.425 1095.83 968.807C1096.32 968.181 1096.56 967.373 1096.56 966.382C1096.56 965.375 1096.32 964.563 1095.83 963.945C1095.34 963.327 1094.68 963.018 1093.85 963.018Z"
                  fill="white"
                />
              </g>
            </g>
            <g ref={this.train} className={styles.train} id="train-ns">
              <g id="front">
                <path
                  id="path1178"
                  d="M1505.1 744.56L1539.7 762.955H1642.25L1685.98 739.707L1705.83 706.225H1628.38V715.734H1549.96V706.225H1479.28L1505.1 744.56Z"
                  fill="#151515"
                />
                <path
                  id="path1049"
                  d="M1441.64 698.082L1358.16 746.28V701.123"
                  fill="#242424"
                />
                <path
                  id="path1891"
                  d="M1358.18 711.128L1360 586.989L1385.56 508.49C1385.56 508.49 1425.72 461.025 1487.79 437.292C1549.86 413.56 1599.15 413.56 1599.15 413.56L3327.96 414.929V705.651H2995.71L2959.2 753.116H1741.55L1708.68 711.128H1358.18Z"
                  fill="#FFAE01"
                />
                <path
                  id="path1039"
                  d="M1483.08 438.947H3328.13V414.854L1595.06 413C1570.84 415.27 1558.9 417.212 1539.2 421.361C1511.83 428.312 1500.62 432.152 1483.08 438.947Z"
                  fill="#4B4B4B"
                />
                <path
                  id="rect1062"
                  d="M1561.57 521.977C1552.59 521.977 1545.36 529.207 1545.36 538.186V609.79C1545.36 618.769 1552.59 625.999 1561.57 625.999H1566.86H1689.43H1705.64V609.79V538.186V521.977H1689.43H1566.86H1561.57Z"
                  fill="#003674"
                />
                <path
                  id="rect1154"
                  d="M2921.6 466.903H1773.26C1766.76 466.903 1761.49 472.172 1761.49 478.671V513.191C1761.49 519.69 1766.76 524.959 1773.26 524.959H2921.6C2928.09 524.959 2933.36 519.69 2933.36 513.191V478.671C2933.36 472.172 2928.09 466.903 2921.6 466.903Z"
                  fill="#003374"
                />
                <path
                  id="rect1064"
                  d="M2948.57 596.919H1751.77V698.679H2948.57V596.919Z"
                  fill="#003674"
                />
                <path
                  id="rect1893"
                  d="M1822.95 474.035H1783.54C1776.53 474.035 1770.84 479.721 1770.84 486.735V505.148C1770.84 512.162 1776.53 517.849 1783.54 517.849H1822.95C1829.96 517.849 1835.65 512.162 1835.65 505.148V486.735C1835.65 479.721 1829.96 474.035 1822.95 474.035Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  stroke-width="0.165"
                />
                <path
                  id="rect1895"
                  d="M1945.4 474.146H1878.71C1871.73 474.146 1866.08 479.802 1866.08 486.78V505.097C1866.08 512.074 1871.73 517.731 1878.71 517.731H1945.4C1952.38 517.731 1958.04 512.074 1958.04 505.097V486.78C1958.04 479.802 1952.38 474.146 1945.4 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  stroke-width="0.196037"
                />
                <path
                  id="path1076"
                  d="M1705.64 521.977L1751.75 596.928V698.689L1705.64 625.999V521.977Z"
                  fill="#003674"
                />
                <path
                  id="rect1943"
                  d="M1821.18 611.113H1785.27C1777.4 611.113 1771.02 617.492 1771.02 625.361V674.963C1771.02 682.831 1777.4 689.21 1785.27 689.21H1821.18C1829.05 689.21 1835.43 682.831 1835.43 674.963V625.361C1835.43 617.492 1829.05 611.113 1821.18 611.113Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  stroke-width="0.219605"
                />
                <path
                  id="rect5637"
                  d="M1682.32 515.668H1572.75V691.872H1682.32V515.668Z"
                  fill="#FFAE01"
                  stroke="#4D4D4D"
                  stroke-width="0.160927"
                />
                <path
                  id="rect5641"
                  d="M1521.6 517.384H1465.92V682.598H1521.6V517.384Z"
                  fill="#FFAE01"
                  stroke="#4D4D4D"
                  stroke-width="0.165"
                />
                <path
                  id="rect5647"
                  d="M1521.81 680.379H1465.73V701.243H1521.81V680.379Z"
                  fill="#313131"
                  stroke="#4D4D4D"
                  stroke-width="0.0588466"
                />
                <path
                  id="path1140"
                  d="M1358.19 708.564H1333.54V723.853H1370.05L1358.19 708.564Z"
                  fill="#161616"
                  stroke="#161616"
                  stroke-width="0.264583"
                />
                <path
                  id="path1142"
                  d="M1333.83 700.971C1333.83 700.971 1332 709.643 1332 716.489C1332 723.335 1334.05 730.637 1334.05 730.637"
                  stroke="#141414"
                  stroke-width="0.165"
                />
                <path
                  id="rect1158"
                  d="M1498.07 539.544H1489.47C1484.12 539.544 1479.79 543.876 1479.79 549.22V600.826C1479.79 606.17 1484.12 610.502 1489.47 610.502H1498.07C1503.41 610.502 1507.74 606.17 1507.74 600.826V549.22C1507.74 543.876 1503.41 539.544 1498.07 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <g id="path1160">
                  <path d="M1627.44 691.648V515.606V691.648Z" fill="#FFAE01" />
                  <path
                    d="M1627.44 691.648V515.606"
                    stroke="#4D4D4D"
                    stroke-width="0.160602"
                  />
                </g>
                <path
                  id="rect1162"
                  d="M1604.43 539.544H1595.83C1590.49 539.544 1586.16 543.876 1586.16 549.22V600.826C1586.16 606.17 1590.49 610.502 1595.83 610.502H1604.43C1609.78 610.502 1614.11 606.17 1614.11 600.826V549.22C1614.11 543.876 1609.78 539.544 1604.43 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <path
                  id="rect1164"
                  d="M1659.94 539.544H1651.34C1645.99 539.544 1641.66 543.876 1641.66 549.22V600.826C1641.66 606.17 1645.99 610.502 1651.34 610.502H1659.94C1665.28 610.502 1669.61 606.17 1669.61 600.826V549.22C1669.61 543.876 1665.28 539.544 1659.94 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <path
                  id="circle1180"
                  d="M1497.16 766.739C1513.27 766.739 1526.32 753.686 1526.32 737.585C1526.32 721.484 1513.27 708.432 1497.16 708.432C1481.06 708.432 1468.01 721.484 1468.01 737.585C1468.01 753.686 1481.06 766.739 1497.16 766.739Z"
                  fill="#2D2D2D"
                  stroke="#4B4B4B"
                  stroke-width="0.527318"
                />
                <path
                  id="circle1182"
                  d="M1689.02 766.739C1705.12 766.739 1718.17 753.686 1718.17 737.585C1718.17 721.484 1705.12 708.432 1689.02 708.432C1672.92 708.432 1659.87 721.484 1659.87 737.585C1659.87 753.686 1672.92 766.739 1689.02 766.739Z"
                  fill="#2D2D2D"
                  stroke="#4B4B4B"
                  stroke-width="0.527318"
                />
                <path
                  id="rect1200"
                  d="M1682.85 692.369H1572.07V703.689H1682.85V692.369Z"
                  fill="#282828"
                />
                <path
                  id="rect1080"
                  d="M1360.68 658.258H1358.46C1357.08 658.258 1355.96 659.379 1355.96 660.761V672.859C1355.96 674.242 1357.08 675.363 1358.46 675.363H1360.68C1362.06 675.363 1363.18 674.242 1363.18 672.859V660.761C1363.18 659.379 1362.06 658.258 1360.68 658.258Z"
                  fill="#FFAE01"
                />
                <path
                  id="rect1100"
                  d="M1944.2 611.268H1880.15C1872.69 611.268 1866.64 617.315 1866.64 624.775V675.555C1866.64 683.015 1872.69 689.062 1880.15 689.062H1944.2C1951.66 689.062 1957.71 683.015 1957.71 675.555V624.775C1957.71 617.315 1951.66 611.268 1944.2 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  stroke-width="0.260628"
                />
                <path
                  id="1"
                  d="M1841.33 606.016H1840.88V603.043L1839.98 603.373V602.968L1841.26 602.488H1841.33V606.016Z"
                  fill="white"
                />
                <path
                  id="1_2"
                  d="M1840.8 469.477H1840.36V466.504L1839.46 466.834V466.429L1840.73 465.949H1840.8V469.477Z"
                  fill="white"
                />
                <path
                  id="path1132"
                  d="M1642.69 610.652L1628.11 596.073V625.231L1642.69 610.652Z"
                  fill="white"
                />
                <path
                  id="path1134"
                  d="M1612.33 610.652L1626.91 596.073V625.231L1612.33 610.652Z"
                  fill="white"
                />
                <path
                  id="circle1136"
                  d="M1692.86 615.092C1695.09 615.092 1696.9 613.286 1696.9 611.058C1696.9 608.83 1695.09 607.024 1692.86 607.024C1690.64 607.024 1688.83 608.83 1688.83 611.058C1688.83 613.286 1690.64 615.092 1692.86 615.092Z"
                  fill="#4B4B4B"
                />
                <path
                  id="circle1138"
                  d="M1692.89 614.45C1694.77 614.45 1696.28 612.933 1696.28 611.061C1696.28 609.19 1694.77 607.673 1692.89 607.673C1691.02 607.673 1689.51 609.19 1689.51 611.061C1689.51 612.933 1691.02 614.45 1692.89 614.45Z"
                  fill="#E7E7E7"
                />
                <path
                  id="circle1140"
                  d="M1692.92 612.228C1693.56 612.228 1694.09 611.704 1694.09 611.058C1694.09 610.412 1693.56 609.888 1692.92 609.888C1692.27 609.888 1691.75 610.412 1691.75 611.058C1691.75 611.704 1692.27 612.228 1692.92 612.228Z"
                  fill="#000D58"
                />
                <path
                  id="path1151"
                  d="M1459.99 659.674V578.665"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <path
                  id="path1153"
                  d="M1526.95 659.674V578.665"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <path
                  id="rect1146"
                  d="M2975.78 731.695H1724.57L1741 753.811H2959.91L2975.78 731.695Z"
                  fill="#4B4B4B"
                />
              </g>
            </g>
            <g
              ref={this.trainShadow}
              className={styles.train_shadow}
              id="train-shadow"
            >
              <path
                id="path1891_2"
                d="M1365.49 759.68L1390.56 846.707L1427.13 913.751C1427.13 913.751 1425.45 933.23 1487.52 949.931C1549.59 966.631 1598.88 966.631 1598.88 966.631L3463.6 966.632L3316.55 727.681H2958.93H1741.28H1357.91L1365.49 759.68Z"
                fill="url(#paint5_linear_122_3315)"
              />
            </g>
            <g
              ref={this.secondTrainShadow}
              className={styles.second_train_shadow}
              id="train-shadow"
            >
              <path
                id="path1891_3"
                d="M369.103 760.006L344.037 847.05L307.467 914.108C307.467 914.108 309.144 933.591 247.075 950.295C185.006 967 135.715 967 135.715 967L-1729 967L-1581.95 728H-1224.33H-6.67864H376.69L369.103 760.006Z"
                fill="url(#paint6_linear_122_3315)"
              />
            </g>
            <g id="trees">
              <g id="tree" filter="url(#filter1_d_122_3315)">
                <path
                  id="Vector_146"
                  d="M1769.03 702.41C1768.32 701.619 1767.62 700.828 1766.9 700.037C1761.27 693.808 1755.23 687.652 1747.49 684.081C1743.81 682.324 1739.78 681.391 1735.7 681.346C1731.47 681.359 1727.35 682.467 1723.45 684.017C1721.6 684.754 1719.8 685.59 1718.02 686.481C1715.99 687.502 1714 688.592 1712.01 689.69C1708.29 691.751 1704.61 693.903 1700.99 696.145C1693.77 700.607 1686.77 705.409 1680.01 710.551C1676.5 713.218 1673.06 715.972 1669.7 718.814C1666.57 721.454 1663.51 724.165 1660.51 726.946C1659.86 727.538 1658.91 726.58 1659.55 725.988C1660.34 725.251 1661.14 724.519 1661.94 723.795C1664.2 721.752 1666.5 719.748 1668.83 717.783C1673.08 714.194 1677.45 710.744 1681.92 707.432C1688.88 702.279 1696.07 697.476 1703.51 693.022C1707.22 690.798 1710.99 688.667 1714.81 686.63C1715.96 686.015 1717.13 685.414 1718.31 684.845C1720.98 683.494 1723.77 682.362 1726.62 681.459C1730.67 680.149 1734.96 679.728 1739.19 680.225C1743.27 680.819 1747.2 682.179 1750.78 684.234C1758.37 688.479 1764.26 695.042 1769.99 701.447C1770.57 702.098 1769.62 703.061 1769.03 702.41Z"
                  fill="#E4E4E4"
                />
                <path
                  id="Vector_147"
                  d="M1745.1 691.918C1735.85 687.165 1724.01 688.096 1715.51 694.034C1731.72 696.83 1747.75 700.572 1763.52 705.24C1756.97 701.402 1751.85 695.388 1745.1 691.918Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_148"
                  d="M1715.42 694.018L1713.64 695.465C1714.24 694.958 1714.87 694.484 1715.51 694.034C1715.48 694.029 1715.45 694.023 1715.42 694.018Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_149"
                  d="M1671.57 968.366C1672.02 968.581 1672.51 968.68 1673.01 968.654C1673.51 968.629 1674 968.48 1674.42 968.221C1674.64 968.088 1674.82 968.444 1674.6 968.576C1674.13 968.86 1673.59 969.024 1673.04 969.053C1672.49 969.082 1671.94 968.976 1671.44 968.744C1671.39 968.726 1671.35 968.69 1671.33 968.643C1671.3 968.597 1671.3 968.543 1671.31 968.493C1671.33 968.443 1671.37 968.402 1671.41 968.378C1671.46 968.354 1671.52 968.35 1671.57 968.366Z"
                  fill="white"
                />
                <path
                  id="Vector_150"
                  d="M1869.84 714.672C1867.93 711.143 1867.67 706.517 1870.01 703.259C1871.17 707.465 1873.77 711.126 1877.37 713.594C1878.76 714.54 1880.41 715.449 1880.88 717.062C1881.13 718.091 1880.98 719.176 1880.45 720.095C1879.93 721.001 1879.29 721.837 1878.55 722.58L1878.48 722.833C1875.03 720.788 1871.75 718.201 1869.84 714.672Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_151"
                  d="M1700.29 899.261C1683.78 899.261 1667.81 893.364 1655.26 882.632C1651.08 879.049 1646.61 872.819 1642 864.117C1639.06 858.511 1637.41 852.318 1637.18 845.991C1636.95 839.665 1638.14 833.367 1640.66 827.561C1638.23 830.035 1635.54 832.241 1632.64 834.142L1631.17 835.118L1631.09 833.359C1631.03 832.215 1631 831.075 1631 829.97C1631 823.5 1631.89 817.061 1633.65 810.837C1641.66 782.698 1643.03 752.479 1637.72 721.021C1636.81 715.607 1636.36 710.127 1636.36 704.637C1636.36 650.8 1680.16 607 1734.01 607C1754.54 606.971 1774.56 613.424 1791.21 625.438C1807.86 637.452 1820.29 654.415 1826.73 673.909L1827.02 674.799L1826.15 675.15C1821.71 677.017 1817.03 678.261 1812.25 678.848C1817.35 679.888 1822.55 680.324 1827.75 680.147L1828.56 680.119L1828.76 680.903C1830.69 688.666 1831.67 696.637 1831.67 704.637L1831.66 705.502C1831.65 711.579 1832.91 717.591 1835.37 723.148C1837.83 728.704 1841.44 733.679 1845.95 737.748C1853.08 744.248 1858.78 752.162 1862.68 760.985C1866.58 769.808 1868.6 779.347 1868.61 788.995C1868.61 800.408 1860.85 815.39 1854.34 825.949C1852.69 828.638 1850.46 830.919 1847.8 832.621C1845.14 834.323 1842.14 835.401 1839 835.774C1836.04 836.148 1833.02 835.866 1830.18 834.946C1827.33 834.027 1824.72 832.493 1822.53 830.454C1825.61 836.647 1829.63 842.33 1834.44 847.303L1835.32 848.218L1834.22 848.86C1823.63 855.038 1811.58 858.291 1799.32 858.286L1798.6 858.284C1779.98 858.284 1762.31 865.498 1750.11 878.075C1743.64 884.745 1735.89 890.055 1727.34 893.693C1718.78 897.332 1709.59 899.224 1700.29 899.261Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_152"
                  d="M1675.86 1007.8C1675.56 1007.8 1675.27 1007.69 1675.04 1007.5C1674.81 1007.3 1674.67 1007.03 1674.62 1006.73C1674.57 1006.36 1669.39 968.961 1674.04 919.255C1678.34 873.351 1692.16 807.233 1733.53 752.931C1733.63 752.8 1733.76 752.691 1733.9 752.608C1734.04 752.526 1734.2 752.472 1734.36 752.45C1734.52 752.428 1734.69 752.438 1734.84 752.479C1735 752.521 1735.15 752.594 1735.28 752.693C1735.41 752.793 1735.52 752.917 1735.6 753.058C1735.69 753.2 1735.74 753.356 1735.76 753.519C1735.78 753.681 1735.77 753.846 1735.73 754.005C1735.69 754.163 1735.61 754.311 1735.52 754.441C1694.5 808.274 1680.79 873.908 1676.52 919.488C1671.89 968.904 1677.04 1006.01 1677.09 1006.38C1677.12 1006.56 1677.1 1006.74 1677.05 1006.91C1677 1007.08 1676.92 1007.24 1676.8 1007.37C1676.68 1007.51 1676.54 1007.62 1676.37 1007.69C1676.21 1007.76 1676.03 1007.8 1675.86 1007.8H1675.86Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_153"
                  d="M1696.54 824.733C1696.28 824.733 1696.02 824.65 1695.81 824.496C1695.6 824.341 1695.44 824.123 1695.36 823.873C1695.27 823.622 1695.27 823.353 1695.35 823.102C1695.44 822.852 1695.59 822.634 1695.81 822.479C1695.96 822.37 1711.09 811.463 1733.72 803.178C1754.64 795.519 1786.45 788.576 1819.2 798.999C1819.36 799.048 1819.5 799.127 1819.63 799.232C1819.76 799.338 1819.86 799.467 1819.94 799.613C1820.01 799.758 1820.06 799.917 1820.07 800.081C1820.09 800.245 1820.07 800.41 1820.02 800.566C1819.97 800.723 1819.89 800.868 1819.78 800.993C1819.68 801.119 1819.55 801.222 1819.4 801.297C1819.25 801.372 1819.09 801.417 1818.93 801.43C1818.77 801.443 1818.6 801.424 1818.45 801.373C1786.37 791.165 1755.13 797.993 1734.58 805.518C1712.27 813.685 1697.42 824.388 1697.27 824.495C1697.06 824.65 1696.8 824.733 1696.54 824.733Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_154"
                  d="M1641.55 933.107C1639.64 929.578 1639.37 924.952 1641.71 921.694C1642.87 925.9 1645.48 929.561 1649.08 932.029C1650.47 932.975 1652.11 933.884 1652.59 935.497C1652.84 936.526 1652.68 937.611 1652.16 938.53C1651.63 939.436 1650.99 940.272 1650.25 941.016L1650.19 941.268C1646.73 939.223 1643.45 936.636 1641.55 933.107Z"
                  fill="#9AB967"
                />
              </g>
              <g id="bush" filter="url(#filter2_d_122_3315)">
                <path
                  id="Vector_155"
                  d="M1863.64 931.685C1863.67 988.171 1830.1 1007.91 1788.68 1007.93C1787.71 1007.93 1786.76 1007.92 1785.8 1007.9C1783.88 1007.86 1781.98 1007.77 1780.11 1007.64C1742.72 1005.01 1713.66 984.29 1713.64 931.758C1713.61 877.394 1783.06 808.754 1788.27 803.679C1788.27 803.679 1788.27 803.679 1788.28 803.674C1788.48 803.481 1788.58 803.384 1788.58 803.384C1788.58 803.384 1863.61 875.204 1863.64 931.685Z"
                  fill="#BEDD8C"
                />
                <path
                  id="Vector_156"
                  d="M1785.94 999.289L1813.35 960.949L1785.88 1003.5L1785.8 1007.9C1783.88 1007.86 1781.99 1007.77 1780.11 1007.64L1783.03 951.127L1783.01 950.689L1783.06 950.607L1783.34 945.267L1755.75 902.641L1783.42 941.266L1783.49 942.399L1785.7 899.703L1762.08 855.653L1785.99 892.2L1788.27 803.679L1788.28 803.384L1788.28 803.674L1787.93 873.482L1811.4 845.796L1787.83 879.494L1787.22 917.724L1809.15 881.026L1787.14 923.344L1786.8 944.602L1818.62 893.519L1786.68 952.018L1785.94 999.289Z"
                  fill="#3F3D56"
                />
              </g>
              <g id="bush_2" filter="url(#filter3_d_122_3315)">
                <path
                  id="Vector_157"
                  d="M1681 958.21C1681.02 995.868 1658.64 1009.03 1631.02 1009.04C1630.38 1009.04 1629.75 1009.03 1629.11 1009.02C1627.83 1008.99 1626.56 1008.93 1625.31 1008.85C1600.39 1007.09 1581.02 993.28 1581 958.259C1580.98 922.016 1627.28 876.257 1630.75 872.873C1630.76 872.873 1630.76 872.873 1630.76 872.87C1630.89 872.741 1630.96 872.677 1630.96 872.677C1630.96 872.677 1680.98 920.556 1681 958.21Z"
                  fill="#BEDD8C"
                />
                <path
                  id="Vector_158"
                  d="M1629.2 1003.28L1647.48 977.72L1629.16 1006.08L1629.11 1009.02C1627.83 1008.99 1626.57 1008.93 1625.31 1008.85L1627.26 971.172L1627.25 970.88L1627.28 970.825L1627.47 967.265L1609.07 938.848L1627.52 964.598L1627.57 965.353L1629.04 936.889L1613.29 907.522L1629.23 931.887L1630.75 872.873L1630.76 872.677L1630.76 872.87L1630.53 919.409L1646.18 900.951L1630.46 923.417L1630.06 948.903L1644.67 924.438L1630 952.65L1629.78 966.822L1650.99 932.766L1629.7 971.766L1629.2 1003.28Z"
                  fill="#3F3D56"
                />
              </g>
            </g>
            <g id="trees_2" filter="url(#filter4_d_122_3315)">
              <g id="tree_2">
                <path
                  id="Vector_159"
                  d="M1552.55 906.893C1552.55 970.181 1514.93 992.279 1468.51 992.279C1422.1 992.279 1384.48 970.181 1384.48 906.893C1384.48 843.605 1468.51 763.092 1468.51 763.092C1468.51 763.092 1552.55 843.605 1552.55 906.893Z"
                  fill="#44A34E"
                />
                <path
                  id="Vector_160"
                  d="M1465.45 982.598L1466.31 929.631L1502.13 864.104L1466.45 921.322L1466.84 897.507L1491.52 850.099L1466.94 891.204L1467.63 848.37L1494.07 810.627L1467.74 841.635L1468.18 763.093L1465.45 867.068L1465.67 862.779L1438.79 821.641L1465.24 871.013L1462.73 918.851L1462.66 917.581L1431.68 874.29L1462.57 922.067L1462.25 928.049L1462.2 928.139L1462.22 928.63L1455.87 1050H1464.36L1465.38 987.311L1496.19 939.651L1465.45 982.598Z"
                  fill="#3F3D56"
                />
              </g>
              <g id="tree_3">
                <path
                  id="Vector_161"
                  d="M1377.76 857.222C1377.76 926.417 1336.62 950.577 1285.88 950.577C1235.14 950.577 1194 926.417 1194 857.222C1194 788.027 1285.88 700 1285.88 700C1285.88 700 1377.76 788.027 1377.76 857.222Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_162"
                  d="M1282.53 939.993L1283.47 882.082L1322.63 810.44L1283.62 872.998L1284.04 846.96L1311.03 795.127L1284.15 840.069L1284.92 793.237L1313.82 751.971L1285.04 785.873L1285.51 700L1282.52 813.68L1282.77 808.99L1253.38 764.014L1282.3 817.993L1279.56 870.296L1279.48 868.907L1245.6 821.577L1279.38 873.812L1279.03 880.353L1278.97 880.452L1279 880.988L1272.05 1013.69H1281.33L1282.45 945.145L1316.14 893.037L1282.53 939.993Z"
                  fill="#3F3D56"
                />
              </g>
            </g>
            <g
              ref={this.secondTrain}
              className={styles.second_train}
              id="train-ns_2"
            >
              <g id="back">
                <path
                  id="path1178_2"
                  d="M227.787 744.56L193.187 762.955H90.6316L46.9035 739.707L27.0562 706.225H104.508V715.734H182.929V706.225H253.604L227.787 744.56Z"
                  fill="#151515"
                />
                <path
                  id="path1049_2"
                  d="M291.469 698.082L374.95 746.28V701.123"
                  fill="#242424"
                />
                <path
                  id="path1891_4"
                  d="M374.938 711.128L373.113 586.989L347.555 508.49C347.555 508.49 307.393 461.025 245.323 437.292C183.254 413.56 133.964 413.56 133.964 413.56L-1594.85 414.929V705.651H-1262.59L-1226.08 753.116H-8.43052L24.4296 711.128H374.938Z"
                  fill="#FFAE01"
                />
                <path
                  id="path1039_2"
                  d="M250.037 438.947H-1595.01V414.854L138.057 413C162.271 415.27 174.216 417.212 193.911 421.361C221.289 428.312 232.494 432.152 250.037 438.947Z"
                  fill="#4B4B4B"
                />
                <path
                  id="rect1062_2"
                  d="M171.429 521.977C180.408 521.977 187.638 529.207 187.638 538.186V609.79C187.638 618.769 180.408 625.999 171.429 625.999H166.137H43.5709H27.3615V609.79V538.186V521.977H43.5709H166.137H171.429Z"
                  fill="#003674"
                />
                <path
                  id="path1076_2"
                  d="M27.3594 521.977L-18.7526 596.928V698.689L27.3594 625.999V521.977Z"
                  fill="#003674"
                />
                <path
                  id="rect5637_2"
                  d="M50.6871 515.668H160.256V691.872H50.6871V515.668Z"
                  fill="#FFAE01"
                  stroke="#4D4D4D"
                  stroke-width="0.160927"
                />
                <path
                  id="rect5641_2"
                  d="M211.404 517.384H267.083V682.598H211.404V517.384Z"
                  fill="#FFAE01"
                  stroke="#4D4D4D"
                  stroke-width="0.165"
                />
                <path
                  id="rect5647_2"
                  d="M211.298 680.379H267.38V701.243H211.298V680.379Z"
                  fill="#313131"
                  stroke="#4D4D4D"
                  stroke-width="0.0588466"
                />
                <path
                  id="path1140_2"
                  d="M374.93 708.564H399.575V723.853H363.063L374.93 708.564Z"
                  fill="#161616"
                  stroke="#161616"
                  stroke-width="0.264583"
                />
                <path
                  id="path1142_2"
                  d="M399.183 700.971C399.183 700.971 401.001 709.643 401.001 716.489C401.001 723.335 398.956 730.637 398.956 730.637"
                  stroke="#141414"
                  stroke-width="0.165"
                />
                <path
                  id="rect1158_2"
                  d="M234.934 539.544H243.535C248.879 539.544 253.211 543.876 253.211 549.22V600.826C253.211 606.17 248.879 610.502 243.535 610.502H234.934C229.59 610.502 225.258 606.17 225.258 600.826V549.22C225.258 543.876 229.59 539.544 234.934 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <g id="path1160_2">
                  <path d="M105.45 691.648V515.606Z" fill="#FFAE01" />
                  <path
                    d="M105.45 691.648V515.606"
                    stroke="#4D4D4D"
                    stroke-width="0.160602"
                  />
                </g>
                <path
                  id="rect1162_2"
                  d="M128.454 539.544H137.055C142.399 539.544 146.731 543.876 146.731 549.22V600.826C146.731 606.17 142.399 610.502 137.055 610.502H128.454C123.11 610.502 118.778 606.17 118.778 600.826V549.22C118.778 543.876 123.11 539.544 128.454 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <path
                  id="rect1164_2"
                  d="M72.9472 539.544H81.5481C86.892 539.544 91.2241 543.876 91.2241 549.22V600.826C91.2241 606.17 86.892 610.502 81.5481 610.502H72.9472C67.6033 610.502 63.2712 606.17 63.2712 600.826V549.22C63.2712 543.876 67.6033 539.544 72.9472 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <path
                  id="circle1180_2"
                  d="M235.837 766.739C219.736 766.739 206.683 753.686 206.683 737.585C206.683 721.484 219.736 708.432 235.837 708.432C251.938 708.432 264.99 721.484 264.99 737.585C264.99 753.686 251.938 766.739 235.837 766.739Z"
                  fill="#2D2D2D"
                  stroke="#4B4B4B"
                  stroke-width="0.527318"
                />
                <path
                  id="circle1182_2"
                  d="M43.9801 766.739C27.8789 766.739 14.8264 753.686 14.8264 737.585C14.8264 721.484 27.8789 708.432 43.9801 708.432C60.0812 708.432 73.1338 721.484 73.1338 737.585C73.1338 753.686 60.0812 766.739 43.9801 766.739Z"
                  fill="#2D2D2D"
                  stroke="#4B4B4B"
                  stroke-width="0.527318"
                />
                <path
                  id="rect1200_2"
                  d="M50.1484 692.369H160.933V703.689H50.1484V692.369Z"
                  fill="#282828"
                />
                <path
                  id="rect1080_2"
                  d="M372.323 658.258H374.538C375.921 658.258 377.042 659.379 377.042 660.761V672.859C377.042 674.242 375.921 675.363 374.538 675.363H372.323C370.941 675.363 369.82 674.242 369.82 672.859V660.761C369.82 659.379 370.941 658.258 372.323 658.258Z"
                  fill="#FFAE01"
                />
                <path
                  id="path1132_2"
                  d="M90.1993 610.652L104.778 596.074V625.231L90.1993 610.652Z"
                  fill="white"
                />
                <path
                  id="path1134_2"
                  d="M120.67 610.652L106.092 596.074V625.231L120.67 610.652Z"
                  fill="white"
                />
                <path
                  id="circle1136_2"
                  d="M40.0251 615.092C37.7972 615.092 35.9911 613.286 35.9911 611.058C35.9911 608.83 37.7972 607.024 40.0251 607.024C42.253 607.024 44.0591 608.83 44.0591 611.058C44.0591 613.286 42.253 615.092 40.0251 615.092Z"
                  fill="#4B4B4B"
                />
                <path
                  id="circle1138_2"
                  d="M40.2228 614.45C38.3513 614.45 36.8342 612.933 36.8342 611.062C36.8342 609.19 38.3513 607.673 40.2228 607.673C42.0942 607.673 43.6113 609.19 43.6113 611.062C43.6113 612.933 42.0942 614.45 40.2228 614.45Z"
                  fill="#E7E7E7"
                />
                <path
                  id="circle1140_2"
                  d="M40.0863 612.228C39.443 612.228 38.9216 611.704 38.9216 611.058C38.9216 610.412 39.443 609.888 40.0863 609.888C40.7295 609.888 41.251 610.412 41.251 611.058C41.251 611.704 40.7295 612.228 40.0863 612.228Z"
                  fill="#000D58"
                />
                <path
                  id="path1151_2"
                  d="M273.011 659.674V578.665"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <path
                  id="path1153_2"
                  d="M206.051 659.674V578.665"
                  stroke="#4B4B4B"
                  stroke-width="0.165"
                />
                <path
                  id="rect1146_2"
                  d="M-1242.89 731.695H8.30908L-8.11196 753.811H-1227.03L-1242.89 731.695Z"
                  fill="#4B4B4B"
                />
              </g>
            </g>
            <g id="bush_3">
              <path
                id="Vector_163"
                d="M457.147 927.279H297.538C297.538 927.279 294.303 879.827 313.445 879.288C332.587 878.749 330.43 900.318 354.426 870.66C378.421 841.003 407.539 842.621 411.313 860.146C415.088 877.67 404.034 891.69 424.255 887.376C444.475 883.063 473.593 894.386 457.147 927.279Z"
                fill="#44A34E"
              />
              <path
                id="Vector_164"
                d="M374.648 927.29L374.11 927.268C375.366 896.026 381.909 875.953 387.177 864.616C392.896 852.305 398.408 847.322 398.463 847.273L398.821 847.676C398.767 847.724 393.319 852.658 387.646 864.885C382.407 876.175 375.9 896.166 374.648 927.29Z"
                fill="#F2F2F2"
              />
              <path
                id="Vector_165"
                d="M432.415 927.354L431.897 927.203C438.13 905.809 452.809 892.301 452.956 892.167L453.319 892.566C453.172 892.699 438.604 906.111 432.415 927.354Z"
                fill="#F2F2F2"
              />
              <path
                id="Vector_166"
                d="M322.677 927.316L322.143 927.241C324.258 911.989 320.438 900.156 316.861 892.915C312.988 885.075 308.568 880.793 308.524 880.75L308.897 880.361C308.942 880.404 313.43 884.752 317.344 892.676C320.955 899.985 324.811 911.928 322.677 927.316Z"
                fill="#F2F2F2"
              />
              <path
                id="Vector_167"
                d="M478.809 928H280.323L280.277 927.328C280.163 925.655 277.631 886.201 290.415 872.124C293.272 868.977 296.715 867.325 300.646 867.214C308.979 866.977 314.216 870.099 318.439 872.604C326.4 877.327 331.659 880.447 350.781 856.813C371.496 831.21 393.846 825.702 406.694 828.765C414.996 830.744 420.718 836.338 422.392 844.113C423.978 851.475 423.473 858.392 423.067 863.95C422.633 869.897 422.29 874.595 424.732 876.723C426.771 878.499 430.841 878.661 437.539 877.231C451.164 874.325 470.174 876.812 479.716 889.141C484.85 895.773 488.894 907.83 479.008 927.601L478.809 928ZM281.677 926.557H477.916C485.282 911.612 485.512 898.987 478.575 890.024C469.822 878.714 451.457 875.737 437.84 878.642C430.563 880.195 426.226 879.939 423.785 877.811C420.798 875.209 421.165 870.194 421.628 863.845C422.027 858.379 422.524 851.576 420.982 844.416C419.429 837.207 414.1 832.013 406.36 830.168C393.921 827.201 372.195 832.639 351.902 857.72C331.997 882.323 326.001 878.767 317.704 873.845C313.428 871.309 308.573 868.433 300.687 868.656C297.163 868.756 294.066 870.249 291.482 873.094C279.993 885.745 281.396 921.223 281.677 926.557Z"
                fill="#CFCCE0"
              />
            </g>
            <g id="bush_4">
              <path
                id="Vector_168"
                d="M229.576 1002.13H38.0456C38.0456 1002.13 34.1633 945.193 57.134 944.546C80.1048 943.899 77.5165 969.781 106.311 934.193C135.105 898.604 170.047 900.545 174.576 921.575C179.106 942.604 165.841 959.428 190.106 954.252C214.37 949.075 249.312 962.663 229.576 1002.13Z"
                fill="#44A34E"
              />
              <path
                id="Vector_169"
                d="M130.578 1002.15L129.931 1002.12C131.439 964.632 139.291 940.544 145.612 926.939C152.475 912.166 159.089 906.186 159.155 906.127L159.585 906.611C159.52 906.669 152.983 912.59 146.175 927.262C139.889 940.81 132.08 964.799 130.578 1002.15Z"
                fill="#F2F2F2"
              />
              <path
                id="Vector_170"
                d="M199.898 1002.22L199.277 1002.04C206.756 976.371 224.37 960.161 224.547 960L224.982 960.479C224.807 960.639 207.324 976.734 199.898 1002.22Z"
                fill="#F2F2F2"
              />
              <path
                id="Vector_171"
                d="M68.2127 1002.18L67.5716 1002.09C70.1093 983.788 65.5254 969.587 61.2329 960.898C56.5851 951.49 51.2821 946.351 51.229 946.301L51.6767 945.833C51.7306 945.885 57.1156 951.103 61.813 960.612C66.1456 969.382 70.773 983.714 68.2127 1002.18Z"
                fill="#F2F2F2"
              />
              <path
                id="Vector_172"
                d="M255.571 1003H17.3873L17.3324 1002.19C17.1954 1000.19 14.157 952.841 29.4974 935.949C32.9268 932.172 37.0578 930.19 41.7753 930.057C51.7748 929.773 58.0587 933.518 63.1271 936.525C72.6802 942.192 78.9912 945.936 101.937 917.576C126.795 886.852 153.615 880.242 169.033 883.918C178.995 886.293 185.861 893.006 187.871 902.335C189.773 911.17 189.167 919.47 188.681 926.14C188.159 933.277 187.748 938.913 190.679 941.468C193.126 943.599 198.009 943.793 206.047 942.078C222.396 938.59 245.209 941.574 256.659 956.369C262.82 964.328 267.673 978.796 255.81 1002.52L255.571 1003ZM19.0128 1001.27H254.499C263.339 983.335 263.615 968.184 255.29 957.428C244.786 943.857 222.749 940.285 206.408 943.771C197.675 945.634 192.472 945.327 189.542 942.773C185.958 939.651 186.397 933.633 186.954 926.014C187.433 919.455 188.029 911.291 186.179 902.7C184.315 894.048 177.92 887.816 168.632 885.602C153.706 882.041 127.635 888.567 103.283 918.664C79.3965 948.187 72.201 943.92 62.2442 938.014C57.1133 934.971 51.2875 931.519 41.8244 931.788C37.5954 931.907 33.8795 933.698 30.7789 937.112C16.9917 952.294 18.6751 994.868 19.0128 1001.27Z"
                fill="#CFCCE0"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_122_3315"
              x="967"
              y="938"
              width="153"
              height="65.5811"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="8" />
              <feGaussianBlur stdDeviation="4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_122_3315"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_122_3315"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_d_122_3315"
              x="1631"
              y="607"
              width="257.999"
              height="408.803"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="4" dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_122_3315"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_122_3315"
                result="shape"
              />
            </filter>
            <filter
              id="filter2_d_122_3315"
              x="1709.64"
              y="803.384"
              width="158"
              height="212.543"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_122_3315"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_122_3315"
                result="shape"
              />
            </filter>
            <filter
              id="filter3_d_122_3315"
              x="1577"
              y="872.677"
              width="108"
              height="144.362"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_122_3315"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_122_3315"
                result="shape"
              />
            </filter>
            <filter
              id="filter4_d_122_3315"
              x="1190"
              y="700"
              width="366.55"
              height="358"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_122_3315"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_122_3315"
                result="shape"
              />
            </filter>
            <radialGradient
              id="paint0_radial_122_3315"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(557.661 -453.966) rotate(103.128) scale(1194.03 3193.03)"
            >
              <stop offset="0.23021" stop-color="#55ACFC" />
              <stop offset="1" stop-color="white" />
            </radialGradient>
            <linearGradient
              id="paint1_linear_122_3315"
              x1="32640.8"
              y1="26345.7"
              x2="32640.8"
              y2="4.41992"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#808080" stop-opacity="0.25" />
              <stop offset="0.54" stop-color="#808080" stop-opacity="0.12" />
              <stop offset="1" stop-color="#808080" stop-opacity="0.1" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_122_3315"
              x1="1071"
              y1="1121.36"
              x2="1036.51"
              y2="590.149"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.123398" stop-color="#9AB967" />
              <stop offset="1" stop-color="white" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_122_3315"
              x1="701.607"
              y1="905.423"
              x2="601.859"
              y2="1395.37"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.171875" stop-color="white" />
              <stop offset="0.869792" stop-color="#949494" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_122_3315"
              x1="1151.29"
              y1="536.301"
              x2="1110.38"
              y2="997.353"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.123398" stop-color="#949494" />
              <stop offset="1" stop-color="white" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_122_3315"
              x1="2410.75"
              y1="966.632"
              x2="2410.75"
              y2="727.681"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#C4C4C4" stop-opacity="0" />
              <stop offset="1" stop-color="#4B4B4B" />
            </linearGradient>
            <linearGradient
              id="paint6_linear_122_3315"
              x1="-676.155"
              y1="967"
              x2="-676.155"
              y2="728"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#C4C4C4" stop-opacity="0" />
              <stop offset="1" stop-color="#4B4B4B" />
            </linearGradient>
            <clipPath id="clip0_122_3315">
              <rect width="1920" height="1080" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  }
}

export default TrainCrash;