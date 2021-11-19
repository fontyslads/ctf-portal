import React, { RefObject, createRef } from "react";
import gsap from "gsap";
import styles from "./Crossover.module.scss";

//components
import { Modal, Button } from "react-bootstrap";
import FlagCard from "../../FlagCard/FlagCard";
import confetti from "canvas-confetti";

//models
import Flag from "../../../models/Flag";
import FlagStatus from "../../../models/enums/FlagStatus";

class Crossover extends React.Component<
  { flags: Flag[] },
  { show: boolean; flag: number }
> {
  private tl = gsap.timeline({ duration: 0.5, ease: "ease" });

  private train: RefObject<SVGGElement>;
  private trainShadow: RefObject<SVGGElement>;
  private armFront: RefObject<SVGGElement>;
  private armBack: RefObject<SVGGElement>;
  private flagFourButton: RefObject<SVGGElement>;
  private flagFiveButton: RefObject<SVGGElement>;

  constructor(props: any) {
    super(props);
    this.train = createRef();
    this.trainShadow = createRef();
    this.armFront = createRef();
    this.armBack = createRef();
    this.flagFourButton = createRef();
    this.flagFiveButton = createRef();

    this.state = { show: false, flag: 1 };
  }

  componentDidMount(): void {
    this.animateBariers();
    this.animateTrain();
    this.animateSpeedup();
  }

  componentDidUpdate(props: { flags: Flag[] }): void {
    if (!props || !props.flags.length) return;

    const flagFour = 4;
    const flagFive = 5;
    if (
      this.isFlagValid(flagFour) &&
      props.flags[flagFour - 1].status !== FlagStatus.Valid
    ) {
      this.closeFlagSubmitModal();
      this.runConfetti();
      this.revertBariers();
      this.animateSpeedup();
    }
    if (
      this.isFlagValid(flagFive) &&
      props.flags[flagFive - 1].status !== FlagStatus.Valid
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
      );
  }

  animateBariers(): void {
    this.tl
      .to(this.armFront.current, {
        rotateZ: 80,
        transformOrigin: "right",
      })
      .to(
        this.armBack.current,
        {
          rotateZ: -80,
          transformOrigin: "left",
        },
        "<"
      );
    this.tl.to(this.flagFourButton.current, {
      opacity: 1,
    });
  }
  revertBariers(): void {
    this.tl
      .to(this.armFront.current, {
        rotateZ: 0,
        transformOrigin: "right",
      })
      .to(
        this.armBack.current,
        {
          rotateZ: 0,
          transformOrigin: "left",
        },
        "<"
      );
  }

  animateSpeedup(): void {
    if (this.isFlagValid(4))
      this.tl.to(this.flagFiveButton.current, {
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
          <g id="road_crossing (4+5)" clipPath="url(#clip0_118_1500)">
            <rect width="1920" height="1080" fill="white" />
            <g id="sky">
              <rect
                id="skybox"
                width="1920"
                height="729"
                fill="url(#paint0_radial_118_1500)"
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
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_3"
                  d="M1055.06 47.8098H874.124C868.623 47.8098 864.164 52.2691 864.164 57.7698V59.5398C864.164 65.0406 868.623 69.4998 874.124 69.4998H1055.06C1060.56 69.4998 1065.02 65.0406 1065.02 59.5398V57.7698C1065.02 52.2691 1060.56 47.8098 1055.06 47.8098Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_4"
                  d="M978.734 63.8799H797.794C792.293 63.8799 787.834 68.3391 787.834 73.8399V75.6099C787.834 81.1106 792.293 85.5699 797.794 85.5699H978.734C984.235 85.5699 988.694 81.1106 988.694 75.6099V73.8399C988.694 68.3391 984.235 63.8799 978.734 63.8799Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_5"
                  d="M666.194 277.6H485.254C479.753 277.6 475.294 282.059 475.294 287.56V289.33C475.294 294.831 479.753 299.29 485.254 299.29H666.194C671.695 299.29 676.154 294.831 676.154 289.33V287.56C676.154 282.059 671.695 277.6 666.194 277.6Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_6"
                  d="M1640.02 82.7646H1459.08C1453.58 82.7646 1449.12 87.2239 1449.12 92.7247V94.4947C1449.12 99.9954 1453.58 104.455 1459.08 104.455H1640.02C1645.52 104.455 1649.98 99.9954 1649.98 94.4947V92.7247C1649.98 87.2239 1645.52 82.7646 1640.02 82.7646Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_7"
                  d="M711.184 296.08H530.244C524.743 296.08 520.284 300.539 520.284 306.04V307.81C520.284 313.311 524.743 317.77 530.244 317.77H711.184C716.685 317.77 721.144 313.311 721.144 307.81V306.04C721.144 300.539 716.685 296.08 711.184 296.08Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_8"
                  d="M1685.01 101.245H1504.07C1498.57 101.245 1494.11 105.704 1494.11 111.205V112.975C1494.11 118.476 1498.57 122.935 1504.07 122.935H1685.01C1690.51 122.935 1694.97 118.476 1694.97 112.975V111.205C1694.97 105.704 1690.51 101.245 1685.01 101.245Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_9"
                  d="M634.854 312.14H453.914C448.413 312.14 443.954 316.599 443.954 322.1V323.87C443.954 329.371 448.413 333.83 453.914 333.83H634.854C640.355 333.83 644.814 329.371 644.814 323.87V322.1C644.814 316.599 640.355 312.14 634.854 312.14Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_10"
                  d="M1608.68 117.305H1427.74C1422.24 117.305 1417.78 121.764 1417.78 127.265V129.035C1417.78 134.535 1422.24 138.995 1427.74 138.995H1608.68C1614.18 138.995 1618.64 134.535 1618.64 129.035V127.265C1618.64 121.764 1614.18 117.305 1608.68 117.305Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_11"
                  d="M465.324 128.15H284.384C278.883 128.15 274.424 132.609 274.424 138.11V139.88C274.424 145.381 278.883 149.84 284.384 149.84H465.324C470.825 149.84 475.284 145.381 475.284 139.88V138.11C475.284 132.609 470.825 128.15 465.324 128.15Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_12"
                  d="M510.324 146.63H329.384C323.883 146.63 319.424 151.089 319.424 156.59V158.36C319.424 163.861 323.883 168.32 329.384 168.32H510.324C515.825 168.32 520.284 163.861 520.284 158.36V156.59C520.284 151.089 515.825 146.63 510.324 146.63Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_13"
                  d="M433.994 162.7H253.054C247.553 162.7 243.094 167.159 243.094 172.66V174.43C243.094 179.931 247.553 184.39 253.054 184.39H433.994C439.495 184.39 443.954 179.931 443.954 174.43V172.66C443.954 167.159 439.495 162.7 433.994 162.7Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <g id="Group" opacity="0.5">
                  <path
                    id="Vector_14"
                    opacity="0.5"
                    d="M382.094 166.72C426.912 166.72 463.244 130.388 463.244 85.5699C463.244 40.752 426.912 4.41992 382.094 4.41992C337.276 4.41992 300.944 40.752 300.944 85.5699C300.944 130.388 337.276 166.72 382.094 166.72Z"
                    fill="url(#paint1_linear_118_1500)"
                  />
                </g>
              </g>
            </g>
            <rect
              id="grass"
              y="816"
              width="3787"
              height="264"
              fill="url(#paint2_linear_118_1500)"
            />
            <g id="traffic_light" filter="url(#filter0_d_118_1500)">
              <path
                id="Vector_15"
                d="M295 570.052C297.504 570.052 300.21 571.203 301.834 575.939"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_16"
                d="M295 586.496C297.504 586.496 300.21 587.646 301.834 592.383"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_17"
                d="M295 602.939C297.504 602.939 300.21 604.089 301.834 608.826"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_18"
                d="M325.992 570.052C323.488 570.052 320.781 571.203 319.157 575.939"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_19"
                d="M325.992 586.496C323.488 586.496 320.781 587.646 319.157 592.383"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_20"
                d="M325.992 602.939C323.488 602.939 320.781 604.089 319.157 608.826"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_21"
                d="M313.135 564.977V564.571C313.135 563.15 311.984 562 310.563 562C309.142 562 307.992 563.15 307.992 564.571V564.977H303.594C301.496 564.977 299.804 566.669 299.804 568.767V617.081C299.804 619.179 301.496 620.871 303.594 620.871H317.466C319.563 620.871 321.255 619.179 321.255 617.081V568.767C321.255 566.669 319.563 564.977 317.466 564.977H313.135Z"
                fill="#333333"
              />
              <g id="Rectangle 16" filter="url(#filter1_d_118_1500)">
                <rect
                  x="308.636"
                  y="620.884"
                  width="3.71901"
                  height="91.1157"
                  fill="#333333"
                />
              </g>
            </g>
            <g id="car_front" filter="url(#filter2_d_118_1500)">
              <path
                id="Vector 31"
                d="M358.548 685.034C357.8 677.656 357.607 673.719 361.048 670.034L457.048 668.534C459.726 674.401 459.834 678.544 459.048 686.534C458.496 693.123 457.832 697.039 455.048 705.034C452.985 707.408 451.779 708.699 449.048 710.534C447.022 711.095 445.946 710.959 444.048 710.534C440.564 708.543 438.196 708.043 434.048 707.034H383.548C379.654 707.935 377.639 708.644 374.548 710.534C372.442 710.847 371.229 710.775 369.048 710.534C367.326 709.502 366.266 708.629 364.048 706.034C362.126 701.847 360.966 698.05 358.548 685.034Z"
                fill="#5F5858"
              />
              <path
                id="Rectangle 25"
                d="M358.001 691.463C358.009 688.731 360.242 686.534 362.975 686.534H368C370.761 686.534 373 688.773 373 691.534V710.345C373 713.179 370.647 715.447 367.814 715.342L363.742 715.19C361.314 715.1 359.294 713.277 359.011 710.865C358.235 704.259 357.98 698.939 358.001 691.463Z"
                fill="black"
              />
              <path
                id="Rectangle 26"
                d="M460.047 691.463C460.039 688.731 457.806 686.534 455.074 686.534H450.048C447.287 686.534 445.048 688.773 445.048 691.534V710.345C445.048 713.179 447.402 715.447 450.234 715.342L454.306 715.19C456.734 715.1 458.755 713.277 459.038 710.865C459.813 704.259 460.069 698.939 460.047 691.463Z"
                fill="black"
              />
              <path
                id="Vector 30"
                d="M379.548 639.034L385.548 636.034C403.76 634.648 414.204 634.663 433.048 636.034L437.548 638.034C441.466 645.347 443.773 650.069 448.048 659.534C448.189 659.628 448.326 659.72 448.462 659.812L448.548 656.534C448.753 655.184 449.172 654.726 450.048 654.034C451.254 653.3 452.224 653.493 454.048 654.034C455.785 654.928 456.266 655.671 457.048 657.034C456.914 658.452 456.533 658.948 455.548 659.534C454.416 660.089 453.762 660.32 452.548 660.534C451.325 660.489 451.012 660.337 450.548 660.034L450.316 661.145C452.991 663.199 454.683 665.181 457.048 668.534C458.525 682.105 458.275 688.715 453.548 696.534C449.995 700.351 447.165 701.312 441.048 701.534C437.687 704.428 434.742 704.828 429.048 705.034H390.048C381.992 704.737 379.629 703.888 378.048 701.534C373.341 701.354 370.718 700.881 366.048 699.534C365.438 698.11 364.911 697.437 363.548 696.534C362.111 692.97 361.357 690.211 361.048 670.034C363.057 666.908 364.439 664.848 367.048 662.063L366.548 660.534C365.245 660.891 364.394 660.836 362.548 660.034C361.068 659.445 360.506 658.892 360.548 657.034C360.734 655.833 361.172 655.235 363.548 654.534C365.358 654.364 366.195 654.392 367.548 654.534C368.58 655.254 368.878 655.695 369.048 656.534L368.897 660.171C369.107 659.964 369.324 659.752 369.548 659.534C372.839 651.837 374.745 647.491 379.548 639.034Z"
                fill="#F1D263"
              />
              <path
                id="Vector_22"
                d="M372.048 659.034C373.851 653.785 374.736 651.036 380.548 639.534C402.416 637.148 413.678 637.311 435.548 638.534C440.808 647.299 443.082 651.771 446.048 659.034L438.048 658.034C434.974 657.105 432.936 656.751 428.548 656.534C408.941 656.262 404.85 656.367 397.048 656.534C389.984 656.827 386.036 657.234 379.048 659.034H372.048Z"
                fill="black"
                fillOpacity="0.72"
              />
              <path
                id="Vector_23"
                d="M435.548 674.034C413.746 671.764 401.725 671.924 380.548 674.034C382.356 678.776 383.748 680.694 387.048 682.534C403.887 686.154 413.369 686.154 430.548 682.534C434.247 680.409 435.535 678.678 435.548 674.034Z"
                fill="black"
                fillOpacity="0.72"
              />
              <rect
                id="Rectangle 24"
                x="392.048"
                y="688.534"
                width="34"
                height="7"
                rx="2"
                fill="black"
              />
              <ellipse
                id="Ellipse 601"
                cx="370.048"
                cy="672.534"
                rx="8"
                ry="7"
                fill="#C4C4C4"
                fillOpacity="0.7"
              />
              <ellipse
                id="Ellipse 602"
                rx="8"
                ry="7"
                transform="matrix(-1 0 0 1 447.048 672.534)"
                fill="#C4C4C4"
                fillOpacity="0.7"
              />
              <circle
                id="Ellipse 603"
                cx="370.048"
                cy="694.534"
                r="3"
                fill="white"
              />
              <circle
                id="Ellipse 604"
                cx="448.048"
                cy="694.534"
                r="3"
                fill="white"
              />
            </g>
            <path
              id="foot"
              d="M348.364 663.305V659.839C348.364 658.12 346.978 656.727 345.268 656.727H335.096C333.386 656.727 332 658.12 332 659.839V712.636H348.364V676.46V663.305Z"
              fill="#333333"
            />
            <g ref={this.armBack} id="arm">
              <path
                id="Vector_24"
                d="M479.299 671.633H355.629V659.878H479.299C480.792 659.878 482 661.086 482 662.579V668.932C482 670.425 480.792 671.633 479.299 671.633Z"
                fill="#ECF0F1"
              />
              <g id="Group_2">
                <path
                  id="Vector_25"
                  d="M463.505 661.955C464.078 661.382 464.366 660.63 464.366 659.878H457.272L447.594 669.555C447.021 670.128 446.733 670.881 446.733 671.633H453.828L463.505 661.955Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_26"
                  d="M439.994 661.955C440.567 661.382 440.855 660.63 440.855 659.878H433.761L424.083 669.555C423.51 670.128 423.222 670.881 423.222 671.633H430.317L439.994 661.955Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_27"
                  d="M416.483 661.955C417.056 661.382 417.344 660.63 417.344 659.878H410.25L400.572 669.555C399.999 670.128 399.711 670.881 399.711 671.633H406.806L416.483 661.955Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_28"
                  d="M392.972 661.955C393.545 661.382 393.833 660.63 393.833 659.878H386.739L377.061 669.555C376.488 670.128 376.2 670.881 376.2 671.633H383.295L392.972 661.955Z"
                  fill="#C03A2B"
                />
              </g>
              <path
                id="Vector_29"
                d="M358.567 665.755C358.567 672.247 353.304 677.511 346.812 677.511C340.32 677.511 335.056 672.247 335.056 665.755C335.056 659.263 340.32 654 346.812 654C353.304 654 358.567 659.263 358.567 665.755Z"
                fill="#95A5A5"
              />
            </g>
            <g id="track">
              <rect
                id="background"
                y="712"
                width="3787"
                height="104"
                fill="url(#paint3_linear_118_1500)"
              />
              <g id="sleepers">
                <g id="sleeper">
                  <path
                    id="Rectangle 14"
                    d="M1854.3 719.497H1875.07L1878.43 793.216H1850.54L1854.3 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13"
                    d="M1852.19 718.216H1872.96L1876.32 791.935H1848.43L1852.19 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_2">
                  <path
                    id="Rectangle 14_2"
                    d="M1494.3 719.497H1515.07L1518.43 793.216H1490.54L1494.3 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_2"
                    d="M1492.19 718.216H1512.96L1516.32 791.935H1488.43L1492.19 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_3">
                  <path
                    id="Rectangle 14_3"
                    d="M1134.3 719.497H1155.07L1158.43 793.216H1130.54L1134.3 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_3"
                    d="M1132.19 718.216H1152.96L1156.32 791.935H1128.43L1132.19 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_4">
                  <path
                    id="Rectangle 14_4"
                    d="M774.299 719.497H795.07L798.429 793.216H770.542L774.299 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_4"
                    d="M772.187 718.216H792.958L796.317 791.935H768.429L772.187 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_5">
                  <path
                    id="Rectangle 14_5"
                    d="M414.299 719.497H435.07L438.429 793.216H410.542L414.299 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_5"
                    d="M412.187 718.216H432.958L436.317 791.935H408.429L412.187 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_6">
                  <path
                    id="Rectangle 14_6"
                    d="M1710.3 719.497H1731.07L1734.43 793.216H1706.54L1710.3 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_6"
                    d="M1708.19 718.216H1728.96L1732.32 791.935H1704.43L1708.19 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_7">
                  <path
                    id="Rectangle 14_7"
                    d="M1350.3 719.497H1371.07L1374.43 793.216H1346.54L1350.3 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_7"
                    d="M1348.19 718.216H1368.96L1372.32 791.935H1344.43L1348.19 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_8">
                  <path
                    id="Rectangle 14_8"
                    d="M990.299 719.497H1011.07L1014.43 793.216H986.542L990.299 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_8"
                    d="M988.187 718.216H1008.96L1012.32 791.935H984.429L988.187 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_9">
                  <path
                    id="Rectangle 14_9"
                    d="M630.299 719.497H651.07L654.429 793.216H626.542L630.299 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_9"
                    d="M628.187 718.216H648.958L652.317 791.935H624.429L628.187 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_10">
                  <path
                    id="Rectangle 14_10"
                    d="M270.299 719.497H291.07L294.429 793.216H266.542L270.299 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_10"
                    d="M268.187 718.216H288.958L292.317 791.935H264.429L268.187 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_11">
                  <path
                    id="Rectangle 14_11"
                    d="M126.299 719.497H147.07L150.429 793.216H122.542L126.299 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_11"
                    d="M124.187 718.216H144.958L148.317 791.935H120.429L124.187 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_12">
                  <path
                    id="Rectangle 14_12"
                    d="M1565.87 719.497H1586.64L1590 793.216H1562.11L1565.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_12"
                    d="M1563.76 718.216H1584.53L1587.89 791.935H1560L1563.76 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_13">
                  <path
                    id="Rectangle 14_13"
                    d="M1205.87 719.497H1226.64L1230 793.216H1202.11L1205.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_13"
                    d="M1203.76 718.216H1224.53L1227.89 791.935H1200L1203.76 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_14">
                  <path
                    id="Rectangle 14_14"
                    d="M1278.87 719.497H1299.64L1303 793.216H1275.11L1278.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_14"
                    d="M1276.76 718.216H1297.53L1300.89 791.935H1273L1276.76 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_15">
                  <path
                    id="Rectangle 14_15"
                    d="M845.87 719.497H866.641L870 793.216H842.112L845.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_15"
                    d="M843.757 718.216H864.529L867.888 791.935H840L843.757 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_16">
                  <path
                    id="Rectangle 14_16"
                    d="M485.87 719.497H506.641L510 793.216H482.112L485.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_16"
                    d="M483.757 718.216H504.529L507.888 791.935H480L483.757 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_17">
                  <path
                    id="Rectangle 14_17"
                    d="M1781.87 719.497H1802.64L1806 793.216H1778.11L1781.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_17"
                    d="M1779.76 718.216H1800.53L1803.89 791.935H1776L1779.76 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_18">
                  <path
                    id="Rectangle 14_18"
                    d="M1421.87 719.497H1442.64L1446 793.216H1418.11L1421.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_18"
                    d="M1419.76 718.216H1440.53L1443.89 791.935H1416L1419.76 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_19">
                  <path
                    id="Rectangle 14_19"
                    d="M1061.87 719.497H1082.64L1086 793.216H1058.11L1061.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_19"
                    d="M1059.76 718.216H1080.53L1083.89 791.935H1056L1059.76 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_20">
                  <path
                    id="Rectangle 14_20"
                    d="M701.87 719.497H722.641L726 793.216H698.112L701.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_20"
                    d="M699.757 718.216H720.529L723.888 791.935H696L699.757 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_21">
                  <path
                    id="Rectangle 14_21"
                    d="M341.87 719.497H362.641L366 793.216H338.112L341.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_21"
                    d="M339.757 718.216H360.529L363.888 791.935H336L339.757 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_22">
                  <path
                    id="Rectangle 14_22"
                    d="M1637.87 719.497H1658.64L1662 793.216H1634.11L1637.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_22"
                    d="M1635.76 718.216H1656.53L1659.89 791.935H1632L1635.76 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_23">
                  <path
                    id="Rectangle 14_23"
                    d="M917.87 719.497H938.641L942 793.216H914.112L917.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_23"
                    d="M915.757 718.216H936.529L939.888 791.935H912L915.757 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_24">
                  <path
                    id="Rectangle 14_24"
                    d="M557.87 719.497H578.641L582 793.216H554.112L557.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_24"
                    d="M555.757 718.216H576.529L579.888 791.935H552L555.757 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_25">
                  <path
                    id="Rectangle 14_25"
                    d="M197.87 719.497H218.641L222 793.216H194.112L197.87 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_25"
                    d="M195.757 718.216H216.529L219.888 791.935H192L195.757 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_26">
                  <path
                    id="Rectangle 14_26"
                    d="M53.8697 719.497H74.6412L78 793.216H50.1123L53.8697 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_26"
                    d="M51.7574 718.216H72.5289L75.8877 791.935H48L51.7574 718.216Z"
                    fill="#461D23"
                  />
                </g>
                <g id="sleeper_27">
                  <path
                    id="Rectangle 14_27"
                    d="M-18.1303 719.497H2.64121L6.00003 793.216H-21.8877L-18.1303 719.497Z"
                    fill="black"
                    fillOpacity="0.5"
                  />
                  <path
                    id="Rectangle 13_27"
                    d="M-20.2426 718.216H0.528906L3.88772 791.935H-24L-20.2426 718.216Z"
                    fill="#461D23"
                  />
                </g>
              </g>
              <g id="track_2">
                <g id="track_3">
                  <rect
                    id="Rectangle 12"
                    y="727.833"
                    width="1920"
                    height="12"
                    fill="#C4C4C4"
                  />
                  <rect
                    id="Rectangle 13_28"
                    y="731.433"
                    width="1920"
                    height="8"
                    fill="black"
                    fillOpacity="0.5"
                  />
                </g>
                <g id="track_4">
                  <rect
                    id="Rectangle 10"
                    y="762.362"
                    width="1920"
                    height="15"
                    fill="#C4C4C4"
                  />
                  <rect
                    id="Rectangle 14_28"
                    y="767.362"
                    width="1920"
                    height="10"
                    fill="black"
                    fillOpacity="0.5"
                  />
                </g>
              </g>
            </g>
            <g id="road">
              <path
                id="road_2"
                d="M353.566 712L524.038 712L644 1080H194L353.566 712Z"
                fill="#43433E"
              />
              <g id="track_5">
                <rect
                  id="Rectangle 12_2"
                  x="339"
                  y="726.459"
                  width="200"
                  height="12.3484"
                  fill="#C4C4C4"
                />
                <rect
                  id="Rectangle 13_29"
                  x="339"
                  y="730.164"
                  width="200"
                  height="8.23228"
                  fill="black"
                  fillOpacity="0.5"
                />
              </g>
              <g id="track_6">
                <rect
                  id="Rectangle 10_2"
                  x="318"
                  y="761.446"
                  width="250"
                  height="15.4355"
                  fill="#C4C4C4"
                />
                <rect
                  id="Rectangle 14_29"
                  x="318"
                  y="766.592"
                  width="250"
                  height="10.2904"
                  fill="black"
                  fillOpacity="0.5"
                />
              </g>
            </g>
            <g id="traffic_light_2" filter="url(#filter4_d_118_1500)">
              <path
                id="Vector_30"
                d="M597 613.991C601.039 613.991 605.406 615.847 608.026 623.489"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_31"
                d="M597 640.52C601.039 640.52 605.406 642.375 608.026 650.017"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_32"
                d="M597 667.048C601.039 667.048 605.406 668.904 608.026 676.546"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_33"
                d="M647 613.991C642.961 613.991 638.594 615.847 635.974 623.489"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_34"
                d="M647 640.52C642.961 640.52 638.594 642.375 635.974 650.017"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_35"
                d="M647 667.048C642.961 667.048 638.594 668.904 635.974 676.546"
                stroke="#666666"
                strokeWidth="3.888"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                id="Vector_36"
                d="M626.258 605.803V605.148C626.258 602.856 624.402 601 622.109 601C619.816 601 617.961 602.856 617.961 605.148V605.803H610.865C607.48 605.803 604.751 608.533 604.751 611.917V689.865C604.751 693.249 607.48 695.978 610.865 695.978H633.244C636.629 695.978 639.358 693.249 639.358 689.865V611.917C639.358 608.533 636.629 605.803 633.244 605.803H626.258Z"
                fill="#333333"
              />
              <g id="colors">
                <path
                  id="Vector_37"
                  d="M622.109 634.952C627.957 634.952 632.698 630.211 632.698 624.362C632.698 618.514 627.957 613.773 622.109 613.773C616.26 613.773 611.519 618.514 611.519 624.362C611.519 630.211 616.26 634.952 622.109 634.952Z"
                  fill="#E15B64"
                />
                <path
                  id="Vector_38"
                  d="M622.109 661.48C627.957 661.48 632.698 656.739 632.698 650.891C632.698 645.042 627.957 640.301 622.109 640.301C616.26 640.301 611.519 645.042 611.519 650.891C611.519 656.739 616.26 661.48 622.109 661.48Z"
                  fill="#F5E169"
                />
                <path
                  id="Vector_39"
                  d="M622.109 688.009C627.957 688.009 632.698 683.268 632.698 677.419C632.698 671.571 627.957 666.83 622.109 666.83C616.26 666.83 611.519 671.571 611.519 677.419C611.519 683.268 616.26 688.009 622.109 688.009Z"
                  fill="#ABBD81"
                />
              </g>
              <g id="Rectangle 16_2" filter="url(#filter5_d_118_1500)">
                <rect x="619" y="696" width="6" height="147" fill="#333333" />
              </g>
            </g>
            <path
              id="foot_2"
              d="M589 828.647V823.563C589 821.043 591.033 819 593.541 819H608.459C610.967 819 613 821.043 613 823.563V901H589V847.941V828.647Z"
              fill="#333333"
            />
            <g ref={this.armFront} id="arm_2">
              <path
                id="Vector_40"
                d="M396.962 840.862H578.344V823.621H396.961C394.772 823.621 393 825.392 393 827.582V836.901C393 839.09 394.772 840.862 396.962 840.862Z"
                fill="#ECF0F1"
              />
              <g id="Group_3">
                <path
                  id="Vector_41"
                  d="M420.126 826.668C419.286 825.828 418.863 824.724 418.863 823.621H429.268L443.462 837.814C444.302 838.655 444.725 839.758 444.725 840.862H434.32L420.126 826.668Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_42"
                  d="M454.609 826.668C453.768 825.828 453.346 824.724 453.346 823.621H463.751L477.945 837.814C478.785 838.655 479.208 839.758 479.208 840.862H468.802L454.609 826.668Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_43"
                  d="M489.091 826.668C488.251 825.828 487.828 824.724 487.828 823.621H498.233L512.427 837.814C513.268 838.655 513.69 839.758 513.69 840.862H503.285L489.091 826.668Z"
                  fill="#C03A2B"
                />
                <path
                  id="Vector_44"
                  d="M523.574 826.668C522.733 825.828 522.311 824.724 522.311 823.621H532.716L546.91 837.814C547.75 838.655 548.173 839.758 548.173 840.862H537.767L523.574 826.668Z"
                  fill="#C03A2B"
                />
              </g>
              <path
                id="Vector_45"
                d="M574.035 832.241C574.035 841.763 581.755 849.482 591.276 849.482C600.798 849.482 608.517 841.763 608.517 832.241C608.517 822.72 600.798 815 591.276 815C581.755 815 574.035 822.72 574.035 832.241Z"
                fill="#95A5A5"
              />
            </g>
            <g
              id="submit_flag_4"
              onClick={() => this.openFlagSubmitModal(4)}
              ref={this.flagFourButton}
              className={styles.flag_button}
            >
              <rect
                id="Rectangle 27"
                x="588"
                y="788"
                width="135"
                height="47.581"
                rx="9"
                fill={`${this.getFillColor(4)}`}
                stroke="white"
                strokeWidth="2"
              />
              <path
                id="Vector_46"
                d="M623.656 815.216H621.617C621.347 815.216 621.087 815.323 620.896 815.514C620.705 815.705 620.598 815.965 620.598 816.235V823.37H600.211V802.983H609.385C609.655 802.983 609.914 802.876 610.106 802.685C610.297 802.494 610.404 802.234 610.404 801.964V799.925C610.404 799.655 610.297 799.396 610.106 799.205C609.914 799.013 609.655 798.906 609.385 798.906H599.191C598.38 798.906 597.602 799.228 597.029 799.802C596.455 800.375 596.133 801.153 596.133 801.964V824.39C596.133 825.201 596.455 825.978 597.029 826.552C597.602 827.125 598.38 827.448 599.191 827.448H621.617C622.428 827.448 623.206 827.125 623.779 826.552C624.353 825.978 624.675 825.201 624.675 824.39V816.235C624.675 815.965 624.568 815.705 624.376 815.514C624.185 815.323 623.926 815.216 623.656 815.216ZM627.223 794.829H619.069C617.707 794.829 617.027 796.479 617.986 797.441L620.262 799.717L604.734 815.239C604.591 815.381 604.478 815.55 604.401 815.736C604.324 815.922 604.284 816.121 604.284 816.322C604.284 816.523 604.324 816.723 604.401 816.909C604.478 817.094 604.591 817.263 604.734 817.405L606.178 818.847C606.32 818.989 606.489 819.103 606.675 819.18C606.861 819.257 607.06 819.297 607.261 819.297C607.463 819.297 607.662 819.257 607.848 819.18C608.034 819.103 608.202 818.989 608.344 818.847L623.865 803.322L626.14 805.595C627.096 806.551 628.752 805.882 628.752 804.512V796.358C628.752 795.952 628.591 795.563 628.305 795.276C628.018 794.99 627.629 794.829 627.223 794.829V794.829Z"
                fill="white"
              />
              <path
                id="Flag 4"
                d="M654.572 813.884H647.259V821.438H643.45V802.954H655.486V806.039H647.259V810.812H654.572V813.884ZM661.325 821.438H657.644V801.938H661.325V821.438ZM672.32 821.438C672.15 821.108 672.028 820.697 671.951 820.207C671.063 821.197 669.907 821.692 668.486 821.692C667.14 821.692 666.023 821.303 665.134 820.524C664.254 819.745 663.814 818.764 663.814 817.579C663.814 816.123 664.351 815.006 665.426 814.227C666.509 813.448 668.071 813.055 670.111 813.046H671.799V812.259C671.799 811.625 671.634 811.117 671.304 810.736C670.982 810.355 670.47 810.165 669.768 810.165C669.15 810.165 668.663 810.313 668.308 810.609C667.961 810.905 667.787 811.311 667.787 811.828H664.118C664.118 811.032 664.364 810.296 664.855 809.619C665.346 808.942 666.04 808.413 666.937 808.032C667.834 807.642 668.841 807.448 669.958 807.448C671.651 807.448 672.992 807.875 673.983 808.73C674.981 809.576 675.481 810.77 675.481 812.31V818.264C675.489 819.568 675.671 820.554 676.027 821.222V821.438H672.32ZM669.285 818.886C669.827 818.886 670.326 818.768 670.783 818.531C671.24 818.285 671.579 817.959 671.799 817.553V815.192H670.428C668.591 815.192 667.614 815.827 667.495 817.096L667.483 817.312C667.483 817.769 667.643 818.146 667.965 818.442C668.287 818.738 668.727 818.886 669.285 818.886ZM677.766 814.468C677.766 812.361 678.265 810.664 679.264 809.377C680.271 808.091 681.625 807.448 683.326 807.448C684.833 807.448 686.005 807.964 686.843 808.997L686.995 807.702H690.322V820.981C690.322 822.183 690.046 823.228 689.496 824.117C688.955 825.005 688.189 825.682 687.198 826.148C686.208 826.613 685.049 826.846 683.72 826.846C682.713 826.846 681.731 826.643 680.775 826.237C679.818 825.839 679.095 825.323 678.604 824.688L680.229 822.454C681.143 823.478 682.252 823.99 683.555 823.99C684.528 823.99 685.286 823.727 685.827 823.203C686.369 822.686 686.64 821.95 686.64 820.994V820.257C685.794 821.214 684.681 821.692 683.301 821.692C681.651 821.692 680.313 821.049 679.289 819.762C678.274 818.467 677.766 816.753 677.766 814.621V814.468ZM681.435 814.735C681.435 815.979 681.684 816.957 682.184 817.667C682.683 818.37 683.369 818.721 684.24 818.721C685.358 818.721 686.157 818.302 686.64 817.464V811.688C686.149 810.85 685.358 810.431 684.266 810.431C683.386 810.431 682.692 810.791 682.184 811.51C681.684 812.23 681.435 813.305 681.435 814.735ZM710.329 814.481H712.424V817.439H710.329V821.438H706.66V817.439H699.081L698.916 815.128L706.622 802.954H710.329V814.481ZM702.573 814.481H706.66V807.956L706.419 808.375L702.573 814.481Z"
                fill="white"
              />
            </g>
            <g id="car_back" filter="url(#filter8_d_118_1500)">
              <rect
                id="Rectangle 19"
                x="390"
                y="998"
                width="198"
                height="31"
                fill="black"
              />
              <rect
                id="Rectangle 20"
                x="388"
                y="1005"
                width="25"
                height="52"
                rx="5"
                fill="black"
              />
              <rect
                id="Rectangle 22"
                x="551"
                y="996"
                width="25"
                height="52"
                rx="5"
                fill="black"
              />
              <rect
                id="Rectangle 21"
                x="392"
                y="998"
                width="25"
                height="52"
                rx="5"
                fill="black"
              />
              <rect
                id="Rectangle 23"
                x="566"
                y="1005"
                width="25"
                height="52"
                rx="5"
                fill="black"
              />
              <path
                id="Vector 22"
                d="M554.5 897C545.5 882 424.5 881.5 420.5 897C414.939 910.184 413.026 916.848 410 928.5C407.27 930.225 406.061 931.219 404 933C400.309 937.412 398.935 939.602 396.5 943.5C386.507 970.48 387.003 982.297 389.5 1002.5V1016.5C390.832 1021.72 391.884 1023.7 394 1026.5C404.076 1028.53 409.055 1029.06 414 1026.5C417.388 1024.62 419.371 1024.17 423 1024H554.5C558.252 1023.71 559.991 1024.61 563 1026.5C571.345 1027.03 576.209 1026.71 585.5 1024C588.97 1019.51 590.403 1015.95 588.5 1000.5C588.275 995.115 588.5 993 590 989C591.026 972.474 589.374 962.172 579 941.5L572 933C572 933 563.5 912 554.5 897Z"
                fill="#943E3E"
              />
              <path
                id="Vector 23"
                d="M403.5 934L397 943C393.678 942.353 391.939 941.669 389 940C386.214 937.951 385.237 936.521 384.5 933.5C389.679 930.176 392.929 929.021 399.5 928.5C401.956 930.186 402.816 931.394 403.5 934Z"
                fill="#5F5858"
              />
              <path
                id="Vector 24"
                d="M572 933.31L578.5 942C581.822 941.375 583.561 940.715 586.5 939.103C589.286 937.125 590.263 935.744 591 932.828C585.821 929.619 582.571 928.503 576 928C573.544 929.628 572.684 930.794 572 933.31Z"
                fill="#5F5858"
              />
              <path
                id="Vector 25"
                d="M405.494 961.5L399 962C400.29 947.907 401.793 941.654 408.492 939C427.906 939.02 432.04 940.131 433.97 943C434.111 947.383 433.757 948.181 432.971 949C418.771 951.876 415.662 952.859 410.99 954.5C407.116 961.38 406.688 961.053 405.494 961.5Z"
                fill="#C4C4C4"
                fillOpacity="0.7"
              />
              <path
                id="Vector 26"
                d="M574.506 961.5L581 962C579.71 947.907 578.207 941.654 571.508 939C552.094 939.02 547.96 940.131 546.03 943C545.889 947.383 546.243 948.181 547.029 949C561.229 951.876 564.338 952.859 569.01 954.5C572.884 961.38 573.312 961.053 574.506 961.5Z"
                fill="#C4C4C4"
                fillOpacity="0.7"
              />
              <path
                id="Vector 27"
                d="M401 997C395.637 997.408 393.417 998.345 390 1000.5C390.642 997.434 391.08 995.71 401 992H581.5C585.991 993.25 587.476 994.71 588.5 998.5C584.808 997.244 582.661 996.786 578.5 997H401Z"
                fill="#5F5858"
              />
              <path
                id="Vector 28"
                d="M407 1004C402.962 1005.34 401.464 1006.28 399 1008C393.703 1013.65 392.527 1016.96 392 1023L394.5 1027C399.218 1028.71 402.011 1029.55 410 1028.5C413.353 1028.2 415.641 1027.54 420.5 1024H557.5C559.988 1025.63 561.273 1026.2 563.5 1027C573.985 1026.99 579.263 1026.75 583.5 1024C584.354 1021.59 584.563 1019.94 584.5 1016.5C583.902 1014.12 583.288 1012.33 581.5 1008C580.69 1006.49 579.956 1005.63 577 1004C571.008 1001.82 567.307 1001.74 560 1004L552 1008H428.5L420.5 1004C414.811 1002.93 411.808 1002.81 407 1004Z"
                fill="#5F5858"
              />
              <path
                id="Rectangle 18"
                d="M423.021 904.543C424.419 900.719 427.944 898.117 431.973 897.529C475.654 891.152 502.071 891.093 543.479 897.395C547.805 898.053 551.462 901.05 552.752 905.231C554.354 910.423 555.235 914.498 555.68 918.382C556.418 924.823 550.849 930 544.367 930H431.33C424.97 930 419.479 925.022 419.918 918.678C420.245 913.955 421.161 909.634 423.021 904.543Z"
                fill="black"
                fillOpacity="0.7"
              />
              <rect
                id="Rectangle 17"
                x="460"
                y="954"
                width="61"
                height="14"
                rx="5"
                fill="#2C1313"
              />
            </g>
            <g ref={this.train} className={styles.train} id="train-ns">
              <g id="front">
                <path
                  id="path1178"
                  d="M971.098 744.56L1005.7 762.955H1108.25L1151.98 739.707L1171.83 706.225H1094.38V715.734H1015.96V706.225H945.281L971.098 744.56Z"
                  fill="#151515"
                />
                <path
                  id="path1049"
                  d="M907.644 698.082L824.164 746.28V701.123"
                  fill="#242424"
                />
                <path
                  id="path1891"
                  d="M824.176 711.128L826.001 586.989L851.559 508.49C851.559 508.49 891.722 461.025 953.791 437.292C1015.86 413.56 1065.15 413.56 1065.15 413.56L2793.96 414.929V705.651H2461.71L2425.2 753.116H1207.55L1174.68 711.128H824.176Z"
                  fill="#FFAE01"
                />
                <path
                  id="path1039"
                  d="M949.079 438.947H2794.13V414.854L1061.06 413C1036.84 415.27 1024.9 417.212 1005.2 421.361C977.826 428.312 966.621 432.152 949.079 438.947Z"
                  fill="#4B4B4B"
                />
                <path
                  id="rect1062"
                  d="M1027.57 521.977C1018.59 521.977 1011.36 529.207 1011.36 538.186V609.79C1011.36 618.769 1018.59 625.999 1027.57 625.999H1032.86H1155.43H1171.64V609.79V538.186V521.977H1155.43H1032.86H1027.57Z"
                  fill="#003674"
                />
                <path
                  id="rect1154"
                  d="M2387.6 466.903H1239.26C1232.76 466.903 1227.49 472.172 1227.49 478.671V513.191C1227.49 519.69 1232.76 524.959 1239.26 524.959H2387.6C2394.09 524.959 2399.36 519.69 2399.36 513.191V478.671C2399.36 472.172 2394.09 466.903 2387.6 466.903Z"
                  fill="#003374"
                />
                <path
                  id="rect1064"
                  d="M2414.57 596.919H1217.77V698.679H2414.57V596.919Z"
                  fill="#003674"
                />
                <path
                  id="rect1893"
                  d="M1288.95 474.035H1249.54C1242.53 474.035 1236.84 479.721 1236.84 486.735V505.148C1236.84 512.162 1242.53 517.849 1249.54 517.849H1288.95C1295.96 517.849 1301.65 512.162 1301.65 505.148V486.735C1301.65 479.721 1295.96 474.035 1288.95 474.035Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1895"
                  d="M1411.4 474.146H1344.71C1337.73 474.146 1332.08 479.802 1332.08 486.78V505.097C1332.08 512.074 1337.73 517.731 1344.71 517.731H1411.4C1418.38 517.731 1424.04 512.074 1424.04 505.097V486.78C1424.04 479.802 1418.38 474.146 1411.4 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1897"
                  d="M1534.27 474.146H1467.58C1460.6 474.146 1454.94 479.802 1454.94 486.78V505.097C1454.94 512.074 1460.6 517.731 1467.58 517.731H1534.27C1541.25 517.731 1546.9 512.074 1546.9 505.097V486.78C1546.9 479.802 1541.25 474.146 1534.27 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1899"
                  d="M1657.75 474.146H1591.05C1584.08 474.146 1578.42 479.802 1578.42 486.78V505.097C1578.42 512.074 1584.08 517.731 1591.05 517.731H1657.75C1664.73 517.731 1670.38 512.074 1670.38 505.097V486.78C1670.38 479.802 1664.73 474.146 1657.75 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1901"
                  d="M1782.45 474.146H1715.75C1708.78 474.146 1703.12 479.802 1703.12 486.78V505.097C1703.12 512.074 1708.78 517.731 1715.75 517.731H1782.45C1789.43 517.731 1795.08 512.074 1795.08 505.097V486.78C1795.08 479.802 1789.43 474.146 1782.45 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1903"
                  d="M1906.13 474.146H1839.44C1832.46 474.146 1826.81 479.802 1826.81 486.78V505.097C1826.81 512.074 1832.46 517.731 1839.44 517.731H1906.13C1913.11 517.731 1918.77 512.074 1918.77 505.097V486.78C1918.77 479.802 1913.11 474.146 1906.13 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="path1076"
                  d="M1171.64 521.977L1217.75 596.928V698.689L1171.64 625.999V521.977Z"
                  fill="#003674"
                />
                <path
                  id="rect1943"
                  d="M1287.18 611.113H1251.27C1243.4 611.113 1237.02 617.492 1237.02 625.361V674.963C1237.02 682.831 1243.4 689.21 1251.27 689.21H1287.18C1295.05 689.21 1301.43 682.831 1301.43 674.963V625.361C1301.43 617.492 1295.05 611.113 1287.18 611.113Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.219605"
                />
                <path
                  id="rect5637"
                  d="M1148.32 515.668H1038.75V691.872H1148.32V515.668Z"
                  fill="#FFAE01"
                  stroke="#4D4D4D"
                  strokeWidth="0.160927"
                />
                <path
                  id="rect5641"
                  d="M987.595 517.384H931.915V682.598H987.595V517.384Z"
                  fill="#FFAE01"
                  stroke="#4D4D4D"
                  strokeWidth="0.165"
                />
                <path
                  id="rect5647"
                  d="M987.815 680.379H931.733V701.243H987.815V680.379Z"
                  fill="#313131"
                  stroke="#4D4D4D"
                  strokeWidth="0.0588466"
                />
                <path
                  id="path1140"
                  d="M824.186 708.564H799.541V723.853H836.052L824.186 708.564Z"
                  fill="#161616"
                  stroke="#161616"
                  strokeWidth="0.264583"
                />
                <path
                  id="path1142"
                  d="M799.826 700.971C799.826 700.971 798 709.643 798 716.489C798 723.335 800.054 730.637 800.054 730.637"
                  stroke="#141414"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1158"
                  d="M964.066 539.544H955.465C950.121 539.544 945.789 543.876 945.789 549.22V600.826C945.789 606.17 950.121 610.502 955.465 610.502H964.066C969.41 610.502 973.742 606.17 973.742 600.826V549.22C973.742 543.876 969.41 539.544 964.066 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <g id="path1160">
                  <path d="M1093.44 691.648V515.606Z" fill="#FFAE01" />
                  <path
                    d="M1093.44 691.648V515.606"
                    stroke="#4D4D4D"
                    strokeWidth="0.160602"
                  />
                </g>
                <path
                  id="rect1162"
                  d="M1070.43 539.544H1061.83C1056.49 539.544 1052.16 543.876 1052.16 549.22V600.826C1052.16 606.17 1056.49 610.502 1061.83 610.502H1070.43C1075.78 610.502 1080.11 606.17 1080.11 600.826V549.22C1080.11 543.876 1075.78 539.544 1070.43 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1164"
                  d="M1125.94 539.544H1117.34C1111.99 539.544 1107.66 543.876 1107.66 549.22V600.826C1107.66 606.17 1111.99 610.502 1117.34 610.502H1125.94C1131.28 610.502 1135.61 606.17 1135.61 600.826V549.22C1135.61 543.876 1131.28 539.544 1125.94 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <path
                  id="circle1180"
                  d="M963.164 766.739C979.266 766.739 992.318 753.686 992.318 737.585C992.318 721.484 979.266 708.432 963.164 708.432C947.063 708.432 934.011 721.484 934.011 737.585C934.011 753.686 947.063 766.739 963.164 766.739Z"
                  fill="#2D2D2D"
                  stroke="#4B4B4B"
                  strokeWidth="0.527318"
                />
                <path
                  id="circle1182"
                  d="M1155.02 766.739C1171.12 766.739 1184.17 753.686 1184.17 737.585C1184.17 721.484 1171.12 708.432 1155.02 708.432C1138.92 708.432 1125.87 721.484 1125.87 737.585C1125.87 753.686 1138.92 766.739 1155.02 766.739Z"
                  fill="#2D2D2D"
                  stroke="#4B4B4B"
                  strokeWidth="0.527318"
                />
                <path
                  id="rect1200"
                  d="M1148.85 692.369H1038.07V703.689H1148.85V692.369Z"
                  fill="#282828"
                />
                <path
                  id="rect1080"
                  d="M826.678 658.258H824.463C823.08 658.258 821.959 659.379 821.959 660.761V672.859C821.959 674.242 823.08 675.363 824.463 675.363H826.678C828.06 675.363 829.181 674.242 829.181 672.859V660.761C829.181 659.379 828.06 658.258 826.678 658.258Z"
                  fill="#FFAE01"
                />
                <path
                  id="path1082"
                  d="M1465.95 569.495L1457.17 560.703L1465.92 551.989L1474.67 543.274L1485.94 543.318L1497.21 543.363L1498.05 543.665C1499.07 544.032 1500 544.494 1500.74 545.004C1501.05 545.214 1503.9 547.961 1507.09 551.108C1511.71 555.667 1513 556.872 1513.44 557.04C1513.94 557.229 1514.98 557.247 1523.56 557.216L1533.12 557.179L1526.27 550.268L1519.43 543.358L1524.4 543.321L1529.37 543.284L1538.01 551.937C1542.76 556.696 1546.62 560.647 1546.6 560.717C1546.58 560.783 1542.69 564.774 1537.98 569.576L1529.4 578.308L1518.08 578.264L1506.77 578.22L1505.73 577.871C1503.91 577.257 1502.5 576.263 1500.5 574.186C1499.83 573.494 1497.47 571.088 1495.25 568.839C1492.04 565.596 1491.1 564.707 1490.66 564.541C1490.16 564.356 1489.08 564.336 1480.43 564.368L1470.75 564.405L1477.63 571.348L1484.51 578.291H1479.62H1474.73L1465.95 569.495ZM1529.77 567.793L1533.12 564.402L1529.37 564.316C1527.31 564.272 1522.78 564.224 1519.3 564.224C1512.16 564.209 1512.14 564.209 1510.09 563.219L1508.88 562.642L1502.87 556.74C1499.57 553.493 1496.65 550.707 1496.39 550.547L1495.92 550.257L1486.67 550.256L1477.43 550.255L1474.08 553.71L1470.74 557.166L1471.9 557.202C1472.53 557.217 1477.24 557.289 1482.35 557.34L1491.65 557.443L1492.76 557.857C1493.37 558.084 1494.2 558.492 1494.61 558.762C1495.03 559.035 1497.87 561.722 1501 564.805C1504.1 567.858 1506.83 570.499 1507.07 570.672C1507.67 571.114 1508.14 571.136 1517.95 571.16L1526.42 571.175L1529.77 567.793Z"
                  fill="#003474"
                />
                <path
                  id="rect1096"
                  d="M1904.93 611.268H1840.88C1833.42 611.268 1827.37 617.315 1827.37 624.775V675.555C1827.37 683.015 1833.42 689.062 1840.88 689.062H1904.93C1912.39 689.062 1918.44 683.015 1918.44 675.555V624.775C1918.44 617.315 1912.39 611.268 1904.93 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="rect1098"
                  d="M1533.18 611.268H1469.13C1461.67 611.268 1455.62 617.315 1455.62 624.775V675.555C1455.62 683.015 1461.67 689.062 1469.13 689.062H1533.18C1540.64 689.062 1546.69 683.015 1546.69 675.555V624.775C1546.69 617.315 1540.64 611.268 1533.18 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="rect1100"
                  d="M1410.2 611.268H1346.15C1338.69 611.268 1332.64 617.315 1332.64 624.775V675.555C1332.64 683.015 1338.69 689.062 1346.15 689.062H1410.2C1417.66 689.062 1423.71 683.015 1423.71 675.555V624.775C1423.71 617.315 1417.66 611.268 1410.2 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="1"
                  d="M1307.33 606.016H1306.88V603.043L1305.98 603.373V602.968L1307.26 602.488H1307.33V606.016Z"
                  fill="white"
                />
                <path
                  id="1_2"
                  d="M1306.8 469.477H1306.36V466.504L1305.46 466.834V466.429L1306.73 465.949H1306.8V469.477Z"
                  fill="white"
                />
                <path
                  id="path1132"
                  d="M1108.69 610.652L1094.11 596.073V625.231L1108.69 610.652Z"
                  fill="white"
                />
                <path
                  id="path1134"
                  d="M1078.33 610.652L1092.91 596.073V625.231L1078.33 610.652Z"
                  fill="white"
                />
                <path
                  id="circle1136"
                  d="M1158.86 615.092C1161.09 615.092 1162.9 613.286 1162.9 611.058C1162.9 608.83 1161.09 607.024 1158.86 607.024C1156.64 607.024 1154.83 608.83 1154.83 611.058C1154.83 613.286 1156.64 615.092 1158.86 615.092Z"
                  fill="#4B4B4B"
                />
                <path
                  id="circle1138"
                  d="M1158.89 614.45C1160.77 614.45 1162.28 612.933 1162.28 611.061C1162.28 609.19 1160.77 607.673 1158.89 607.673C1157.02 607.673 1155.51 609.19 1155.51 611.061C1155.51 612.933 1157.02 614.45 1158.89 614.45Z"
                  fill="#E7E7E7"
                />
                <path
                  id="circle1140"
                  d="M1158.92 612.228C1159.56 612.228 1160.09 611.704 1160.09 611.058C1160.09 610.412 1159.56 609.888 1158.92 609.888C1158.27 609.888 1157.75 610.412 1157.75 611.058C1157.75 611.704 1158.27 612.228 1158.92 612.228Z"
                  fill="#000D58"
                />
                <path
                  id="rect1085"
                  d="M1801.25 616.562H1696.9V677.513H1801.25V616.562Z"
                  fill="#363636"
                />
                <path
                  id="path1087"
                  d="M1700.89 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1089"
                  d="M1704.19 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1091"
                  d="M1707.49 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1093"
                  d="M1710.79 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1095"
                  d="M1714.08 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1097"
                  d="M1717.38 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1099"
                  d="M1720.68 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1101"
                  d="M1723.98 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1103"
                  d="M1727.28 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1105"
                  d="M1730.69 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1107"
                  d="M1734 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1109"
                  d="M1737.3 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1111"
                  d="M1740.6 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1113"
                  d="M1743.9 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1115"
                  d="M1747.2 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1117"
                  d="M1750.49 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1119"
                  d="M1753.8 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1121"
                  d="M1757.09 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1123"
                  d="M1760.39 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1125"
                  d="M1763.69 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1127"
                  d="M1766.99 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1129"
                  d="M1770.29 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1131"
                  d="M1773.59 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1133"
                  d="M1776.89 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1135"
                  d="M1780.2 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1137"
                  d="M1783.6 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1139"
                  d="M1786.91 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1141"
                  d="M1790.21 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1143"
                  d="M1793.51 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1145"
                  d="M1796.81 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1147"
                  d="M1697.59 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1149"
                  d="M1800.1 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1151"
                  d="M925.99 659.674V578.665"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <path
                  id="path1153"
                  d="M992.948 659.674V578.665"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1146"
                  d="M2441.78 731.695H1190.57L1207 753.811H2425.91L2441.78 731.695Z"
                  fill="#4B4B4B"
                />
              </g>
              <g
                id="submit_flag_5"
                onClick={() => this.openFlagSubmitModal(5)}
                ref={this.flagFiveButton}
                className={styles.flag_button}
              >
                <rect
                  id="Rectangle 27_2"
                  x="881"
                  y="415"
                  width="135"
                  height="47.581"
                  rx="9"
                  fill={`${this.getFillColor(5)}`}
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  id="Vector_47"
                  d="M916.656 442.216H914.617C914.347 442.216 914.087 442.323 913.896 442.514C913.705 442.705 913.598 442.965 913.598 443.235V450.37H893.211V429.983H902.385C902.655 429.983 902.914 429.876 903.106 429.685C903.297 429.494 903.404 429.234 903.404 428.964V426.925C903.404 426.655 903.297 426.396 903.106 426.205C902.914 426.013 902.655 425.906 902.385 425.906H892.191C891.38 425.906 890.602 426.228 890.029 426.802C889.455 427.375 889.133 428.153 889.133 428.964V451.39C889.133 452.201 889.455 452.978 890.029 453.552C890.602 454.125 891.38 454.448 892.191 454.448H914.617C915.428 454.448 916.206 454.125 916.779 453.552C917.353 452.978 917.675 452.201 917.675 451.39V443.235C917.675 442.965 917.568 442.705 917.376 442.514C917.185 442.323 916.926 442.216 916.656 442.216ZM920.223 421.829H912.069C910.707 421.829 910.027 423.479 910.986 424.441L913.262 426.717L897.734 442.239C897.591 442.381 897.478 442.55 897.401 442.736C897.324 442.922 897.284 443.121 897.284 443.322C897.284 443.523 897.324 443.723 897.401 443.909C897.478 444.094 897.591 444.263 897.734 444.405L899.178 445.847C899.32 445.989 899.489 446.103 899.675 446.18C899.861 446.257 900.06 446.297 900.261 446.297C900.463 446.297 900.662 446.257 900.848 446.18C901.034 446.103 901.202 445.989 901.344 445.847L916.865 430.322L919.14 432.595C920.096 433.551 921.752 432.882 921.752 431.512V423.358C921.752 422.952 921.591 422.563 921.305 422.276C921.018 421.99 920.629 421.829 920.223 421.829V421.829Z"
                  fill="white"
                />
                <path
                  id="Flag 5"
                  d="M947.572 440.884H940.259V448.438H936.45V429.954H948.486V433.039H940.259V437.812H947.572V440.884ZM954.325 448.438H950.644V428.938H954.325V448.438ZM965.32 448.438C965.15 448.108 965.028 447.697 964.951 447.207C964.063 448.197 962.907 448.692 961.486 448.692C960.14 448.692 959.023 448.303 958.134 447.524C957.254 446.745 956.814 445.764 956.814 444.579C956.814 443.123 957.351 442.006 958.426 441.227C959.509 440.448 961.071 440.055 963.111 440.046H964.799V439.259C964.799 438.625 964.634 438.117 964.304 437.736C963.982 437.355 963.47 437.165 962.768 437.165C962.15 437.165 961.663 437.313 961.308 437.609C960.961 437.905 960.787 438.311 960.787 438.828H957.118C957.118 438.032 957.364 437.296 957.855 436.619C958.346 435.942 959.04 435.413 959.937 435.032C960.834 434.642 961.841 434.448 962.958 434.448C964.651 434.448 965.992 434.875 966.983 435.73C967.981 436.576 968.481 437.77 968.481 439.31V445.264C968.489 446.568 968.671 447.554 969.027 448.222V448.438H965.32ZM962.285 445.886C962.827 445.886 963.326 445.768 963.783 445.531C964.24 445.285 964.579 444.959 964.799 444.553V442.192H963.428C961.591 442.192 960.614 442.827 960.495 444.096L960.483 444.312C960.483 444.769 960.643 445.146 960.965 445.442C961.287 445.738 961.727 445.886 962.285 445.886ZM970.766 441.468C970.766 439.361 971.265 437.664 972.264 436.377C973.271 435.091 974.625 434.448 976.326 434.448C977.833 434.448 979.005 434.964 979.843 435.997L979.995 434.702H983.322V447.981C983.322 449.183 983.046 450.228 982.496 451.117C981.955 452.005 981.189 452.682 980.198 453.148C979.208 453.613 978.049 453.846 976.72 453.846C975.713 453.846 974.731 453.643 973.775 453.237C972.818 452.839 972.095 452.323 971.604 451.688L973.229 449.454C974.143 450.478 975.252 450.99 976.555 450.99C977.528 450.99 978.286 450.727 978.827 450.203C979.369 449.686 979.64 448.95 979.64 447.994V447.257C978.794 448.214 977.681 448.692 976.301 448.692C974.651 448.692 973.313 448.049 972.289 446.762C971.274 445.467 970.766 443.753 970.766 441.621V441.468ZM974.435 441.735C974.435 442.979 974.684 443.957 975.184 444.667C975.683 445.37 976.369 445.721 977.24 445.721C978.358 445.721 979.157 445.302 979.64 444.464V438.688C979.149 437.85 978.358 437.431 977.266 437.431C976.386 437.431 975.692 437.791 975.184 438.51C974.684 439.23 974.435 440.305 974.435 441.735ZM993.021 439.348L994.087 429.954H1004.45V433.013H997.096L996.639 436.987C997.511 436.521 998.437 436.289 999.419 436.289C1001.18 436.289 1002.56 436.834 1003.56 437.926C1004.56 439.018 1005.06 440.546 1005.06 442.509C1005.06 443.703 1004.8 444.773 1004.29 445.721C1003.79 446.661 1003.08 447.393 1002.14 447.917C1001.2 448.434 1000.09 448.692 998.81 448.692C997.693 448.692 996.656 448.468 995.699 448.019C994.743 447.562 993.986 446.923 993.427 446.102C992.877 445.281 992.585 444.346 992.551 443.296H996.182C996.258 444.067 996.525 444.667 996.982 445.099C997.447 445.522 998.052 445.734 998.797 445.734C999.627 445.734 1000.27 445.438 1000.71 444.845C1001.16 444.244 1001.39 443.398 1001.39 442.306C1001.39 441.257 1001.13 440.453 1000.61 439.894C1000.1 439.335 999.364 439.056 998.416 439.056C997.545 439.056 996.838 439.285 996.296 439.742L995.941 440.072L993.021 439.348Z"
                  fill="white"
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
                d="M831.494 759.68L856.561 846.707L893.13 913.751C893.13 913.751 891.453 933.23 953.523 949.931C1015.59 966.631 1064.88 966.631 1064.88 966.631L2929.6 966.632L2782.55 727.681H2424.93H1207.28H823.907L831.494 759.68Z"
                fill="url(#paint4_linear_118_1500)"
              />
            </g>
            <g id="tripple_tree" filter="url(#filter10_d_118_1500)">
              <g id="tree">
                <path
                  id="Vector_48"
                  d="M1270.23 854.768C1270.23 928.283 1226.52 953.952 1172.61 953.952C1118.7 953.952 1075 928.283 1075 854.768C1075 781.254 1172.61 687.732 1172.61 687.732C1172.61 687.732 1270.23 781.254 1270.23 854.768Z"
                  fill="#44A34E"
                />
                <path
                  id="Vector_49"
                  d="M1169.06 942.706L1170.06 881.181L1211.66 805.066L1170.21 871.529L1170.66 843.866L1199.34 788.797L1170.78 836.545L1171.59 786.789L1202.3 742.948L1171.72 778.965L1172.22 687.732L1169.05 808.508L1169.31 803.526L1138.09 755.742L1168.81 813.09L1165.9 868.659L1165.81 867.184L1129.83 816.897L1165.7 872.394L1165.34 879.344L1165.28 879.448L1165.31 880.019L1157.93 1021H1167.79L1168.97 948.18L1204.76 892.82L1169.06 942.706Z"
                  fill="#3F3D56"
                />
              </g>
              <g id="tree_2">
                <path
                  id="Vector_50"
                  d="M1762.97 841.324C1762.97 914.839 1719.27 940.507 1665.36 940.507C1611.45 940.507 1567.74 914.839 1567.74 841.324C1567.74 767.809 1665.36 674.287 1665.36 674.287C1665.36 674.287 1762.97 767.809 1762.97 841.324Z"
                  fill="#44A34E"
                />
                <path
                  id="Vector_51"
                  d="M1661.8 929.262L1662.8 867.736L1704.41 791.621L1662.96 858.085L1663.41 830.421L1692.08 775.352L1663.53 823.1L1664.33 773.345L1695.04 729.503L1664.46 765.521L1664.97 674.287L1661.79 795.064L1662.05 790.082L1630.84 742.297L1661.55 799.646L1658.64 855.214L1658.56 853.739L1622.57 803.453L1658.45 858.95L1658.08 865.899L1658.02 866.003L1658.05 866.574L1650.67 1007.56H1660.53L1661.71 934.736L1697.5 879.375L1661.8 929.262Z"
                  fill="#3F3D56"
                />
              </g>
              <g id="tree_3">
                <path
                  id="Vector_52"
                  d="M1559.93 783.627C1559.93 864.003 1512.15 892.067 1453.21 892.067C1394.27 892.067 1346.49 864.003 1346.49 783.627C1346.49 703.251 1453.21 601 1453.21 601C1453.21 601 1559.93 703.251 1559.93 783.627Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_53"
                  d="M1449.32 879.772L1450.41 812.504L1495.9 729.285L1450.59 801.952L1451.08 771.706L1482.43 711.498L1451.21 763.702L1452.09 709.303L1485.66 661.369L1452.23 700.749L1452.78 601L1449.31 733.049L1449.6 727.602L1415.47 675.357L1449.05 738.059L1445.87 798.814L1445.78 797.201L1406.43 742.222L1445.66 802.898L1445.26 810.496L1445.19 810.61L1445.22 811.234L1437.15 965.373H1447.93L1449.22 885.757L1488.36 825.229L1449.32 879.772Z"
                  fill="#3F3D56"
                />
              </g>
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_118_1500"
              x="289.056"
              y="562"
              width="42.8796"
              height="158"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_d_118_1500"
              x="304.636"
              y="620.884"
              width="11.719"
              height="99.1157"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter2_d_118_1500"
              x="354"
              y="635"
              width="110.048"
              height="88.345"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter3_d_118_1500"
              x="331"
              y="654"
              width="152"
              height="60.6365"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter4_d_118_1500"
              x="591.056"
              y="601"
              width="61.8879"
              height="250"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter5_d_118_1500"
              x="615"
              y="696"
              width="14"
              height="155"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter6_d_118_1500"
              x="390"
              y="787"
              width="337"
              height="120"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter7_d_118_1500"
              x="579"
              y="787"
              width="153"
              height="65.5811"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter8_d_118_1500"
              x="380.5"
              y="885.562"
              width="214.5"
              height="179.438"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter9_d_118_1500"
              x="872"
              y="414"
              width="153"
              height="65.5811"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <filter
              id="filter10_d_118_1500"
              x="1071"
              y="601"
              width="695.972"
              height="428"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                result="effect1_dropShadow_118_1500"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_118_1500"
                result="shape"
              />
            </filter>
            <radialGradient
              id="paint0_radial_118_1500"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(557.661 -453.966) rotate(103.128) scale(1194.03 3193.03)"
            >
              <stop offset="0.23021" stopColor="#55ACFC" />
              <stop offset="1" stopColor="white" />
            </radialGradient>
            <linearGradient
              id="paint1_linear_118_1500"
              x1="32640.8"
              y1="26345.7"
              x2="32640.8"
              y2="4.41992"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#808080" stopOpacity="0.25" />
              <stop offset="0.54" stopColor="#808080" stopOpacity="0.12" />
              <stop offset="1" stopColor="#808080" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_118_1500"
              x1="2112.44"
              y1="1122"
              x2="2094.35"
              y2="580.944"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.123398" stopColor="#9AB967" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_118_1500"
              x1="2270.81"
              y1="532.3"
              x2="2249.94"
              y2="996.044"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.123398" stopColor="#949494" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_118_1500"
              x1="1876.75"
              y1="966.632"
              x2="1876.75"
              y2="727.681"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C4C4C4" stopOpacity="0" />
              <stop offset="1" stopColor="#4B4B4B" />
            </linearGradient>
            <clipPath id="clip0_118_1500">
              <rect width="1920" height="1080" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  }
}

export default Crossover;
