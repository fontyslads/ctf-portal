import React, { RefObject, createRef } from "react";
import gsap from "gsap";
import styles from "./Platform.module.scss";

//components
import { Modal, Button } from "react-bootstrap";
import FlagCard from "../../FlagCard/FlagCard";
import confetti from "canvas-confetti";

//models
import Flag from "../../../models/Flag";
import FlagStatus from "../../../models/enums/FlagStatus";

class Platform extends React.Component<
  { flags: Flag[] },
  { show: boolean; flag: number }
> {
  private tl = gsap.timeline({ duration: 0.5, ease: "ease" });

  private train: RefObject<SVGGElement>;
  private trainShadow: RefObject<SVGGElement>;
  private screenBackground: RefObject<SVGPathElement>;
  private screenInfo: RefObject<SVGGElement>;
  private textBubble: RefObject<SVGGElement>;
  private flagOneButton: RefObject<SVGGElement>;
  private flagTwoButton: RefObject<SVGGElement>;

  constructor(props: any) {
    super(props);
    this.train = createRef();
    this.trainShadow = createRef();
    this.screenBackground = createRef();
    this.screenInfo = createRef();
    this.textBubble = createRef();
    this.flagOneButton = createRef();
    this.flagTwoButton = createRef();

    this.state = { show: false, flag: 1 };
  }

  componentDidMount(): void {
    this.animateTrain();
    this.animateScreen();
    this.animateDoors();
  }

  componentDidUpdate(props: { flags: Flag[] }): void {
    if (!props || !props.flags.length) return;

    const flagOne = 1;
    const flagTwo = 2;
    const oldFlagOne = props.flags[flagOne - 1];
    const oldFlagTwo = props.flags[flagTwo - 1];
    if (
      this.isFlagSubmitted(flagOne) &&
      oldFlagOne.status !== FlagStatus.Valid &&
      oldFlagOne.status !== FlagStatus.TimedOut
    ) {
      this.closeFlagSubmitModal();
      if (this.isFlagValid(flagOne)) {
        this.runConfetti();
        this.revertScreen();
      }
      this.animateDoors();
    }
    if (
      this.isFlagSubmitted(flagTwo) &&
      oldFlagTwo.status !== FlagStatus.Valid &&
      oldFlagTwo.status !== FlagStatus.TimedOut
    ) {
      this.closeFlagSubmitModal();
      if (this.isFlagValid(flagTwo)) {
        this.runConfetti();
        this.revertDoors();
      }
    }
  }

  isFlagValid(id: number): boolean {
    if (!this.props.flags.length) return false;
    const flag = this.props.flags[id - 1];
    return flag.status === FlagStatus.Valid;
  }

  isFlagSubmitted(id: number): boolean {
    if (!this.props.flags.length) return false;
    const flag = this.props.flags[id - 1];
    return (
      flag.status === FlagStatus.Valid || flag.status === FlagStatus.TimedOut
    );
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
        ease: "easeOut",
        duration: 3,
      })
      .to(
        this.trainShadow.current,
        {
          x: 0,
          ease: "easeOut",
          duration: 3,
        },
        "<"
      );
  }

  animateScreen(): void {
    if (!this.isFlagValid(1))
      this.tl
        .to(
          this.screenBackground.current,
          {
            fill: "red",
            delay: 1,
          },
          "<"
        )
        .to(
          this.screenInfo.current,
          {
            opacity: 0,
          },
          "<"
        );
    this.tl.to(this.flagOneButton.current, {
      opacity: 1,
    });
  }
  revertScreen(): void {
    this.tl
      .to(this.screenBackground.current, {
        fill: "white",
        delay: 1,
      })
      .to(
        this.screenInfo.current,
        {
          opacity: 1,
        },
        "<"
      );
  }

  animateDoors(): void {
    if (this.isFlagSubmitted(1)) {
      this.tl
        .to(this.textBubble.current, {
          opacity: 1,
          delay: 1,
        })
        .to(this.flagTwoButton.current, {
          opacity: 1,
        });
    }
  }
  revertDoors(): void {
    this.tl.to(this.textBubble.current, {
      opacity: 0,
    });
  }

  getBackgroundColor(): string {
    if (!this.props.flags.length) return "";
    switch (this.props.flags[this.state.flag - 1].status) {
      case FlagStatus.TimedOut:
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
      case FlagStatus.TimedOut:
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
          <g id="perron (1+2)" clipPath="url(#clip0_92:39)">
            <rect width="1920" height="1080" fill="white" />
            <g id="sky">
              <rect
                id="skybox"
                width="1920"
                height="729"
                fill="url(#paint0_radial_92:39)"
              />
              <path
                id="sun"
                d="M382.094 157.88C422.03 157.88 454.404 125.506 454.404 85.57C454.404 45.6343 422.03 13.26 382.094 13.26C342.158 13.26 309.784 45.6343 309.784 85.57C309.784 125.506 342.158 157.88 382.094 157.88Z"
                fill="#FCCC63"
              />
              <g id="cloud_4">
                <path
                  id="Vector"
                  d="M1010.07 29.3298H829.134C823.633 29.3298 819.174 33.7891 819.174 39.2898V41.0598C819.174 46.5606 823.633 51.0198 829.134 51.0198H1010.07C1015.57 51.0198 1020.03 46.5606 1020.03 41.0598V39.2898C1020.03 33.7891 1015.57 29.3298 1010.07 29.3298Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_2"
                  d="M1055.06 47.8098H874.124C868.623 47.8098 864.164 52.2691 864.164 57.7698V59.5398C864.164 65.0406 868.623 69.4998 874.124 69.4998H1055.06C1060.56 69.4998 1065.02 65.0406 1065.02 59.5398V57.7698C1065.02 52.2691 1060.56 47.8098 1055.06 47.8098Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_3"
                  d="M978.734 63.8799H797.794C792.293 63.8799 787.834 68.3391 787.834 73.8399V75.6099C787.834 81.1106 792.293 85.5699 797.794 85.5699H978.734C984.235 85.5699 988.694 81.1106 988.694 75.6099V73.8399C988.694 68.3391 984.235 63.8799 978.734 63.8799Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
              </g>
              <g id="cloud_3">
                <path
                  id="Vector_4"
                  d="M666.194 277.6H485.254C479.753 277.6 475.294 282.059 475.294 287.56V289.33C475.294 294.831 479.753 299.29 485.254 299.29H666.194C671.695 299.29 676.154 294.831 676.154 289.33V287.56C676.154 282.059 671.695 277.6 666.194 277.6Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_5"
                  d="M711.184 296.08H530.244C524.743 296.08 520.284 300.539 520.284 306.04V307.81C520.284 313.311 524.743 317.77 530.244 317.77H711.184C716.685 317.77 721.144 313.311 721.144 307.81V306.04C721.144 300.539 716.685 296.08 711.184 296.08Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_6"
                  d="M634.854 312.14H453.914C448.413 312.14 443.954 316.599 443.954 322.1V323.87C443.954 329.371 448.413 333.83 453.914 333.83H634.854C640.355 333.83 644.814 329.371 644.814 323.87V322.1C644.814 316.599 640.355 312.14 634.854 312.14Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
              </g>
              <g id="cloud_2">
                <path
                  id="Vector_7"
                  d="M1640.02 82.7646H1459.08C1453.58 82.7646 1449.12 87.2239 1449.12 92.7247V94.4947C1449.12 99.9954 1453.58 104.455 1459.08 104.455H1640.02C1645.52 104.455 1649.98 99.9954 1649.98 94.4947V92.7247C1649.98 87.2239 1645.52 82.7646 1640.02 82.7646Z"
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
                  d="M1608.68 117.305H1427.74C1422.24 117.305 1417.78 121.764 1417.78 127.265V129.035C1417.78 134.535 1422.24 138.995 1427.74 138.995H1608.68C1614.18 138.995 1618.64 134.535 1618.64 129.035V127.265C1618.64 121.764 1614.18 117.305 1608.68 117.305Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
              </g>
              <g id="cloud_1">
                <path
                  id="Vector_10"
                  d="M465.324 128.15H284.384C278.883 128.15 274.424 132.609 274.424 138.11V139.88C274.424 145.381 278.883 149.84 284.384 149.84H465.324C470.825 149.84 475.284 145.381 475.284 139.88V138.11C475.284 132.609 470.825 128.15 465.324 128.15Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_11"
                  d="M510.324 146.63H329.384C323.883 146.63 319.424 151.089 319.424 156.59V158.36C319.424 163.861 323.883 168.32 329.384 168.32H510.324C515.825 168.32 520.284 163.861 520.284 158.36V156.59C520.284 151.089 515.825 146.63 510.324 146.63Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
                <path
                  id="Vector_12"
                  d="M433.994 162.7H253.054C247.553 162.7 243.094 167.159 243.094 172.66V174.43C243.094 179.931 247.553 184.39 253.054 184.39H433.994C439.495 184.39 443.954 179.931 443.954 174.43V172.66C443.954 167.159 439.495 162.7 433.994 162.7Z"
                  fill="#F2F2F2"
                  fillOpacity="0.7"
                />
              </g>
            </g>
            <g id="buildings">
              <g id="building-svgrepo-com 3" clipPath="url(#clip1_92:39)">
                <g id="Group">
                  <path
                    id="Vector_13"
                    d="M1260.23 100.736H937.067V728.236H1260.23V100.736Z"
                    fill="#E4697F"
                  />
                  <g id="Group_2">
                    <g id="Group_3">
                      <path
                        id="Vector_14"
                        d="M1029.4 163.486H983.234V257.611H1029.4V163.486Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_15"
                        d="M1121.73 163.486H1075.57V257.611H1121.73V163.486Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_16"
                        d="M1214.07 163.486H1167.9V257.611H1214.07V163.486Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_4">
                      <path
                        id="Vector_17"
                        d="M1029.4 163.486H983.234V194.861H1029.4V163.486Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_18"
                        d="M1121.73 163.486H1075.57V194.861H1121.73V163.486Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_19"
                        d="M1214.07 163.486H1167.9V194.861H1214.07V163.486Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_5">
                    <g id="Group_6">
                      <path
                        id="Vector_20"
                        d="M1029.4 320.361H983.234V414.486H1029.4V320.361Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_21"
                        d="M1121.73 320.361H1075.57V414.486H1121.73V320.361Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_22"
                        d="M1214.07 320.361H1167.9V414.486H1214.07V320.361Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_7">
                      <path
                        id="Vector_23"
                        d="M1029.4 320.361H983.234V351.736H1029.4V320.361Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_24"
                        d="M1121.73 320.361H1075.57V351.736H1121.73V320.361Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_25"
                        d="M1214.07 320.361H1167.9V351.736H1214.07V320.361Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_8">
                    <g id="Group_9">
                      <path
                        id="Vector_26"
                        d="M1029.4 477.236H983.234V571.361H1029.4V477.236Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_27"
                        d="M1121.73 477.236H1075.57V571.361H1121.73V477.236Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_28"
                        d="M1214.07 477.236H1167.9V571.361H1214.07V477.236Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_10">
                      <path
                        id="Vector_29"
                        d="M1029.4 477.236H983.234V508.611H1029.4V477.236Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_30"
                        d="M1121.73 477.236H1075.57V508.611H1121.73V477.236Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_31"
                        d="M1214.07 477.236H1167.9V508.611H1214.07V477.236Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_11">
                    <path
                      id="Vector_32"
                      d="M1121.73 634.111H983.234V728.236H1121.73V634.111Z"
                      fill="#E67E22"
                    />
                    <path
                      id="Vector_33"
                      d="M1121.73 634.111H983.234V665.486H1121.73V634.111Z"
                      fill="#D35400"
                    />
                    <path
                      id="Vector_34"
                      d="M1052.48 634.111H1029.4V728.236H1052.48V634.111Z"
                      fill="#D35400"
                    />
                    <path
                      id="Vector_35"
                      d="M1214.07 634.111H1167.9V696.861H1214.07V634.111Z"
                      fill="#3498DB"
                    />
                    <path
                      id="Vector_36"
                      d="M1214.07 634.111H1167.9V665.486H1214.07V634.111Z"
                      fill="#2980B9"
                    />
                  </g>
                  <path
                    id="Vector_37"
                    d="M913.984 69.3611H1283.32L1221.75 6.61108H975.547L913.984 69.3611"
                    fill="#BDC3C7"
                  />
                  <path
                    id="Vector_38"
                    d="M1283.32 69.3611H913.984V100.736H1283.32V69.3611Z"
                    fill="#7F8C8D"
                  />
                  <path
                    id="Vector_39"
                    d="M1260.23 100.736H937.067V132.111H1260.23V100.736Z"
                    fill="#95A5A6"
                  />
                </g>
              </g>
              <g id="building-svgrepo-com 2">
                <g id="Group_12">
                  <path
                    id="Vector_40"
                    d="M1561.57 329.625H1327.07V727.125H1561.57V329.625Z"
                    fill="#C9A23D"
                  />
                  <g id="Group_13">
                    <g id="Group_14">
                      <path
                        id="Vector_41"
                        d="M1394.07 369.375H1360.57V429H1394.07V369.375Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_42"
                        d="M1461.07 369.375H1427.57V429H1461.07V369.375Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_43"
                        d="M1528.07 369.375H1494.57V429H1528.07V369.375Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_15">
                      <path
                        id="Vector_44"
                        d="M1394.07 369.375H1360.57V389.25H1394.07V369.375Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_45"
                        d="M1461.07 369.375H1427.57V389.25H1461.07V369.375Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_46"
                        d="M1528.07 369.375H1494.57V389.25H1528.07V369.375Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_16">
                    <g id="Group_17">
                      <path
                        id="Vector_47"
                        d="M1394.07 468.75H1360.57V528.375H1394.07V468.75Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_48"
                        d="M1461.07 468.75H1427.57V528.375H1461.07V468.75Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_49"
                        d="M1528.07 468.75H1494.57V528.375H1528.07V468.75Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_18">
                      <path
                        id="Vector_50"
                        d="M1394.07 468.75H1360.57V488.625H1394.07V468.75Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_51"
                        d="M1461.07 468.75H1427.57V488.625H1461.07V468.75Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_52"
                        d="M1528.07 468.75H1494.57V488.625H1528.07V468.75Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_19">
                    <g id="Group_20">
                      <path
                        id="Vector_53"
                        d="M1394.07 568.125H1360.57V627.75H1394.07V568.125Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_54"
                        d="M1461.07 568.125H1427.57V627.75H1461.07V568.125Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_55"
                        d="M1528.07 568.125H1494.57V627.75H1528.07V568.125Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_21">
                      <path
                        id="Vector_56"
                        d="M1394.07 568.125H1360.57V588H1394.07V568.125Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_57"
                        d="M1461.07 568.125H1427.57V588H1461.07V568.125Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_58"
                        d="M1528.07 568.125H1494.57V588H1528.07V568.125Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_22">
                    <path
                      id="Vector_59"
                      d="M1461.07 667.5H1360.57V727.125H1461.07V667.5Z"
                      fill="#E67E22"
                    />
                    <path
                      id="Vector_60"
                      d="M1461.07 667.5H1360.57V687.375H1461.07V667.5Z"
                      fill="#D35400"
                    />
                    <path
                      id="Vector_61"
                      d="M1410.82 667.5H1394.07V727.125H1410.82V667.5Z"
                      fill="#D35400"
                    />
                    <path
                      id="Vector_62"
                      d="M1528.07 667.5H1494.57V707.25H1528.07V667.5Z"
                      fill="#3498DB"
                    />
                    <path
                      id="Vector_63"
                      d="M1528.07 667.5H1494.57V687.375H1528.07V667.5Z"
                      fill="#2980B9"
                    />
                  </g>
                  <path
                    id="Vector_64"
                    d="M1310.32 309.75H1578.32L1533.65 270H1354.99L1310.32 309.75"
                    fill="#BDC3C7"
                  />
                  <path
                    id="Vector_65"
                    d="M1578.32 309.75H1310.32V329.625H1578.32V309.75Z"
                    fill="#7F8C8D"
                  />
                  <path
                    id="Vector_66"
                    d="M1561.57 329.625H1327.07V349.5H1561.57V329.625Z"
                    fill="#95A5A6"
                  />
                </g>
              </g>
              <g id="building-svgrepo-com 1">
                <g id="Group_23">
                  <path
                    id="Vector_67"
                    d="M1996.19 182.75H1621.11V727.75H1996.19V182.75Z"
                    fill="#7369E4"
                  />
                  <g id="Group_24">
                    <g id="Group_25">
                      <path
                        id="Vector_68"
                        d="M1728.28 237.25H1674.69V319H1728.28V237.25Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_69"
                        d="M1835.44 237.25H1781.86V319H1835.44V237.25Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_70"
                        d="M1942.61 237.25H1889.03V319H1942.61V237.25Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_26">
                      <path
                        id="Vector_71"
                        d="M1728.28 237.25H1674.69V264.5H1728.28V237.25Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_72"
                        d="M1835.44 237.25H1781.86V264.5H1835.44V237.25Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_73"
                        d="M1942.61 237.25H1889.03V264.5H1942.61V237.25Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_27">
                    <g id="Group_28">
                      <path
                        id="Vector_74"
                        d="M1728.28 373.5H1674.69V455.25H1728.28V373.5Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_75"
                        d="M1835.44 373.5H1781.86V455.25H1835.44V373.5Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_76"
                        d="M1942.61 373.5H1889.03V455.25H1942.61V373.5Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_29">
                      <path
                        id="Vector_77"
                        d="M1728.28 373.5H1674.69V400.75H1728.28V373.5Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_78"
                        d="M1835.44 373.5H1781.86V400.75H1835.44V373.5Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_79"
                        d="M1942.61 373.5H1889.03V400.75H1942.61V373.5Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_30">
                    <g id="Group_31">
                      <path
                        id="Vector_80"
                        d="M1728.28 509.75H1674.69V591.5H1728.28V509.75Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_81"
                        d="M1835.44 509.75H1781.86V591.5H1835.44V509.75Z"
                        fill="#3498DB"
                      />
                      <path
                        id="Vector_82"
                        d="M1942.61 509.75H1889.03V591.5H1942.61V509.75Z"
                        fill="#3498DB"
                      />
                    </g>
                    <g id="Group_32">
                      <path
                        id="Vector_83"
                        d="M1728.28 509.75H1674.69V537H1728.28V509.75Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_84"
                        d="M1835.44 509.75H1781.86V537H1835.44V509.75Z"
                        fill="#2980B9"
                      />
                      <path
                        id="Vector_85"
                        d="M1942.61 509.75H1889.03V537H1942.61V509.75Z"
                        fill="#2980B9"
                      />
                    </g>
                  </g>
                  <g id="Group_33">
                    <path
                      id="Vector_86"
                      d="M1835.44 646H1674.69V727.75H1835.44V646Z"
                      fill="#E67E22"
                    />
                    <path
                      id="Vector_87"
                      d="M1835.44 646H1674.69V673.25H1835.44V646Z"
                      fill="#D35400"
                    />
                    <path
                      id="Vector_88"
                      d="M1755.07 646H1728.28V727.75H1755.07V646Z"
                      fill="#D35400"
                    />
                    <path
                      id="Vector_89"
                      d="M1942.61 646H1889.03V700.5H1942.61V646Z"
                      fill="#3498DB"
                    />
                    <path
                      id="Vector_90"
                      d="M1942.61 646H1889.03V673.25H1942.61V646Z"
                      fill="#2980B9"
                    />
                  </g>
                  <path
                    id="Vector_91"
                    d="M1594.32 155.5H2022.98L1951.53 101H1665.77L1594.32 155.5"
                    fill="#BDC3C7"
                  />
                  <path
                    id="Vector_92"
                    d="M2022.98 155.5H1594.32V182.75H2022.98V155.5Z"
                    fill="#7F8C8D"
                  />
                  <path
                    id="Vector_93"
                    d="M1996.19 182.75H1621.11V210H1996.19V182.75Z"
                    fill="#95A5A6"
                  />
                </g>
              </g>
            </g>
            <g id="trees">
              <g id="tree">
                <path
                  id="Vector_94"
                  d="M224.939 421.607C224.229 420.816 223.524 420.025 222.81 419.234C217.178 413.005 211.134 406.849 203.4 403.278C199.712 401.521 195.687 400.588 191.602 400.543C187.38 400.557 183.254 401.664 179.353 403.215C177.508 403.951 175.705 404.788 173.928 405.678C171.899 406.7 169.905 407.789 167.921 408.887C164.196 410.949 160.52 413.1 156.892 415.342C149.673 419.804 142.68 424.606 135.913 429.748C132.405 432.415 128.97 435.17 125.607 438.011C122.479 440.651 119.414 443.362 116.413 446.143C115.771 446.735 114.813 445.777 115.454 445.185C116.246 444.448 117.046 443.716 117.846 442.993C120.106 440.949 122.402 438.946 124.735 436.981C128.988 433.392 133.352 429.941 137.825 426.629C144.782 421.476 151.978 416.673 159.414 412.219C163.129 409.995 166.896 407.864 170.714 405.827C171.867 405.213 173.033 404.611 174.213 404.042C176.89 402.692 179.671 401.559 182.53 400.656C186.58 399.346 190.865 398.925 195.092 399.422C199.174 400.016 203.106 401.376 206.682 403.432C214.276 407.676 220.166 414.239 225.897 420.645C226.476 421.296 225.522 422.258 224.939 421.607Z"
                  fill="#E4E4E4"
                />
                <path
                  id="Vector_95"
                  d="M201.006 411.115C191.759 406.363 179.917 407.294 171.419 413.231C187.628 416.028 203.659 419.769 219.431 424.437C212.881 420.599 207.758 414.585 201.006 411.115Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_96"
                  d="M171.327 413.215L169.546 414.662C170.149 414.156 170.775 413.681 171.418 413.231C171.387 413.226 171.357 413.22 171.327 413.215Z"
                  fill="#F2F2F2"
                />
                <path
                  id="Vector_97"
                  d="M127.472 687.564C127.923 687.778 128.42 687.877 128.919 687.852C129.417 687.826 129.902 687.677 130.329 687.419C130.547 687.285 130.725 687.641 130.508 687.773C130.035 688.057 129.499 688.221 128.948 688.25C128.397 688.279 127.848 688.173 127.347 687.941C127.298 687.923 127.258 687.887 127.234 687.84C127.211 687.794 127.206 687.74 127.221 687.69C127.238 687.64 127.273 687.599 127.32 687.575C127.367 687.552 127.422 687.547 127.472 687.564V687.564Z"
                  fill="white"
                />
                <path
                  id="Vector_98"
                  d="M325.747 433.869C323.841 430.34 323.575 425.714 325.916 422.457C327.073 426.662 329.681 430.323 333.278 432.791C334.668 433.738 336.314 434.646 336.789 436.26C337.04 437.288 336.885 438.374 336.359 439.292C335.833 440.198 335.193 441.034 334.455 441.778L334.387 442.03C330.937 439.985 327.654 437.398 325.747 433.869Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_99"
                  d="M156.199 618.458C139.686 618.458 123.717 612.561 111.167 601.829C106.981 598.246 102.52 592.016 97.9096 583.314C94.9674 577.708 93.3194 571.515 93.087 565.188C92.8546 558.862 94.0436 552.564 96.5667 546.758C94.1347 549.232 91.4447 551.438 88.5428 553.339L87.0758 554.315L86.991 552.556C86.9354 551.412 86.9073 550.272 86.9073 549.167C86.9016 542.698 87.7945 536.258 89.5602 530.034C97.566 501.895 98.935 471.677 93.6286 440.218C92.7187 434.805 92.2615 429.324 92.2618 423.834C92.2618 369.997 136.07 326.197 189.918 326.197C210.449 326.168 230.465 332.621 247.113 344.635C263.761 356.65 276.192 373.613 282.634 393.107L282.928 393.996L282.06 394.347C277.618 396.214 272.939 397.459 268.155 398.045C273.255 399.085 278.459 399.521 283.66 399.344L284.467 399.316L284.663 400.1C286.598 407.863 287.576 415.834 287.574 423.834L287.571 424.699C287.553 430.776 288.816 436.789 291.277 442.345C293.739 447.901 297.344 452.876 301.857 456.945C308.986 463.445 314.682 471.359 318.583 480.182C322.484 489.005 324.504 498.545 324.514 508.192C324.514 519.605 316.757 534.587 310.25 545.146C308.6 547.835 306.363 550.116 303.707 551.818C301.05 553.52 298.042 554.598 294.91 554.971C291.942 555.346 288.929 555.063 286.083 554.144C283.237 553.224 280.628 551.69 278.44 549.651C281.52 555.844 285.534 561.527 290.341 566.5L291.229 567.415L290.127 568.058C279.533 574.235 267.487 577.488 255.224 577.484L254.505 577.482C235.886 577.482 218.213 584.695 206.018 597.272C199.542 603.943 191.8 609.253 183.245 612.891C174.69 616.529 165.495 618.422 156.199 618.458V618.458Z"
                  fill="#9AB967"
                />
                <path
                  id="Vector_100"
                  d="M131.764 727C131.464 727 131.174 726.891 130.948 726.695C130.722 726.498 130.574 726.226 130.532 725.93C130.479 725.558 125.293 688.158 129.95 638.453C134.251 592.548 148.064 526.43 189.44 472.128C189.539 471.998 189.663 471.888 189.805 471.805C189.946 471.723 190.103 471.669 190.265 471.647C190.427 471.625 190.592 471.635 190.751 471.677C190.909 471.719 191.058 471.791 191.188 471.89C191.318 471.99 191.428 472.114 191.51 472.255C191.593 472.397 191.646 472.554 191.668 472.716C191.69 472.878 191.679 473.043 191.637 473.202C191.595 473.36 191.522 473.509 191.423 473.639C150.404 527.472 136.703 593.105 132.432 638.685C127.802 688.101 132.947 725.209 132.999 725.578C133.024 725.755 133.011 725.935 132.96 726.106C132.91 726.278 132.823 726.436 132.706 726.571C132.589 726.706 132.444 726.814 132.281 726.888C132.119 726.962 131.942 727 131.764 727H131.764Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_101"
                  d="M152.449 543.93C152.186 543.931 151.929 543.847 151.716 543.693C151.503 543.538 151.344 543.32 151.263 543.07C151.181 542.82 151.181 542.55 151.263 542.3C151.344 542.049 151.502 541.831 151.715 541.676C151.865 541.567 167.002 530.661 189.631 522.375C210.55 514.716 242.36 507.773 275.109 518.196C275.266 518.245 275.411 518.324 275.537 518.43C275.663 518.535 275.767 518.664 275.843 518.81C275.919 518.955 275.965 519.115 275.979 519.278C275.994 519.442 275.975 519.607 275.925 519.763C275.876 519.92 275.795 520.065 275.689 520.19C275.583 520.316 275.453 520.419 275.307 520.494C275.161 520.569 275.001 520.614 274.838 520.628C274.674 520.641 274.509 520.621 274.353 520.571C242.276 510.362 211.042 517.19 190.488 524.715C168.182 532.883 153.328 543.585 153.18 543.692C152.968 543.847 152.712 543.93 152.449 543.93Z"
                  fill="#3F3D56"
                />
                <path
                  id="Vector_102"
                  d="M97.4515 652.304C95.5453 648.775 95.2792 644.149 97.6197 640.892C98.7773 645.097 101.385 648.758 104.982 651.226C106.373 652.173 108.018 653.081 108.493 654.695C108.744 655.723 108.59 656.809 108.063 657.727C107.537 658.633 106.897 659.469 106.159 660.213L106.091 660.465C102.641 658.42 99.3577 655.834 97.4515 652.304Z"
                  fill="#9AB967"
                />
              </g>
              <g id="bush">
                <path
                  id="Vector_103"
                  d="M319.546 650.882C319.574 707.368 286.003 727.105 244.583 727.125C243.621 727.125 242.664 727.115 241.711 727.094C239.791 727.054 237.892 726.967 236.012 726.834C198.628 724.206 169.572 703.487 169.546 650.955C169.52 596.591 238.967 527.952 244.176 522.876C244.18 522.876 244.18 522.876 244.185 522.872C244.383 522.678 244.484 522.582 244.484 522.582C244.484 522.582 319.519 594.401 319.546 650.882Z"
                  fill="#BEDD8C"
                />
                <path
                  id="Vector_104"
                  d="M241.85 718.486L269.261 680.146L241.783 722.693L241.711 727.094C239.791 727.054 237.892 726.967 236.012 726.835L238.94 670.324L238.917 669.887L238.967 669.804L239.246 664.464L211.656 621.838L239.326 660.464L239.396 661.596L241.608 618.901L217.986 574.85L241.894 611.397L244.176 522.876L244.185 522.582L244.185 522.872L243.832 592.68L267.309 564.994L243.734 598.691L243.131 636.921L265.057 600.223L243.046 642.542L242.711 663.8L274.532 612.716L242.591 671.215L241.85 718.486Z"
                  fill="#3F3D56"
                />
              </g>
              <g id="bush_2">
                <path
                  id="Vector_105"
                  d="M136.907 677.408C136.926 715.065 114.545 728.223 86.9319 728.236C86.2905 728.236 85.6522 728.229 85.017 728.215C83.7372 728.188 82.4708 728.131 81.2177 728.042C56.2951 726.29 36.9242 712.477 36.9072 677.456C36.8896 641.214 83.1879 595.454 86.6602 592.07C86.6632 592.07 86.6632 592.07 86.6663 592.067C86.7982 591.938 86.8657 591.874 86.8657 591.874C86.8657 591.874 136.889 639.753 136.907 677.408Z"
                  fill="#BEDD8C"
                />
                <path
                  id="Vector_106"
                  d="M85.1096 722.477L103.384 696.917L85.0649 725.282L85.0173 728.216C83.7375 728.189 82.4711 728.131 81.218 728.043L83.1699 690.369L83.1544 690.077L83.1881 690.022L83.3736 686.462L64.9807 658.045L83.4275 683.795L83.4739 684.55L84.9485 656.086L69.2004 626.72L85.1394 651.084L86.6605 592.07L86.6665 591.874L86.6666 592.067L86.4314 638.606L102.083 620.149L86.3658 642.614L85.9639 668.1L100.581 643.635L85.9075 671.847L85.6842 686.019L106.898 651.964L85.6037 690.963L85.1096 722.477Z"
                  fill="#3F3D56"
                />
              </g>
            </g>
            <g ref={this.train} className={styles.train} id="train-ns">
              <g id="front">
                <path
                  id="path1178"
                  d="M560.098 744.56L594.698 762.955H697.254L740.982 739.707L760.829 706.225H683.377V715.734H604.956V706.225H534.281L560.098 744.56Z"
                  fill="#151515"
                />
                <path
                  id="path1049"
                  d="M496.644 698.082L413.164 746.28V701.123"
                  fill="#242424"
                />
                <path
                  id="path1891"
                  d="M413.176 711.128L415.001 586.989L440.559 508.49C440.559 508.49 480.722 461.025 542.791 437.292C604.86 413.56 654.151 413.56 654.151 413.56L2382.96 414.929V705.651H2050.71L2014.2 753.116H796.545L763.685 711.128H413.176Z"
                  fill="#FFAE01"
                />
                <path
                  id="path1039"
                  d="M538.079 438.947H2383.13V414.854L650.059 413C625.844 415.27 613.899 417.212 594.204 421.361C566.826 428.312 555.621 432.152 538.079 438.947Z"
                  fill="#4B4B4B"
                />
                <path
                  id="rect1062"
                  d="M616.57 521.977C607.59 521.977 600.361 529.207 600.361 538.186V609.79C600.361 618.769 607.59 625.999 616.57 625.999H621.861H744.428H760.637V609.79V538.186V521.977H744.428H621.861H616.57Z"
                  fill="#003674"
                />
                <path
                  id="rect1154"
                  d="M1976.6 466.903H828.257C821.758 466.903 816.489 472.172 816.489 478.671V513.191C816.489 519.69 821.758 524.959 828.257 524.959H1976.6C1983.09 524.959 1988.36 519.69 1988.36 513.191V478.671C1988.36 472.172 1983.09 466.903 1976.6 466.903Z"
                  fill="#003374"
                />
                <path
                  id="rect1064"
                  d="M2003.57 596.919H806.775V698.679H2003.57V596.919Z"
                  fill="#003674"
                />
                <path
                  id="rect1893"
                  d="M877.948 474.035H838.541C831.526 474.035 825.84 479.721 825.84 486.735V505.148C825.84 512.162 831.526 517.849 838.541 517.849H877.948C884.962 517.849 890.648 512.162 890.648 505.148V486.735C890.648 479.721 884.962 474.035 877.948 474.035Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1895"
                  d="M1000.4 474.146H933.71C926.732 474.146 921.076 479.802 921.076 486.78V505.097C921.076 512.074 926.732 517.731 933.71 517.731H1000.4C1007.38 517.731 1013.04 512.074 1013.04 505.097V486.78C1013.04 479.802 1007.38 474.146 1000.4 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1897"
                  d="M1123.27 474.146H1056.58C1049.6 474.146 1043.94 479.802 1043.94 486.78V505.097C1043.94 512.074 1049.6 517.731 1056.58 517.731H1123.27C1130.25 517.731 1135.9 512.074 1135.9 505.097V486.78C1135.9 479.802 1130.25 474.146 1123.27 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1899"
                  d="M1246.75 474.146H1180.05C1173.08 474.146 1167.42 479.802 1167.42 486.78V505.097C1167.42 512.074 1173.08 517.731 1180.05 517.731H1246.75C1253.73 517.731 1259.38 512.074 1259.38 505.097V486.78C1259.38 479.802 1253.73 474.146 1246.75 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1901"
                  d="M1371.45 474.146H1304.75C1297.78 474.146 1292.12 479.802 1292.12 486.78V505.097C1292.12 512.074 1297.78 517.731 1304.75 517.731H1371.45C1378.43 517.731 1384.08 512.074 1384.08 505.097V486.78C1384.08 479.802 1378.43 474.146 1371.45 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1903"
                  d="M1495.13 474.146H1428.44C1421.46 474.146 1415.81 479.802 1415.81 486.78V505.097C1415.81 512.074 1421.46 517.731 1428.44 517.731H1495.13C1502.11 517.731 1507.77 512.074 1507.77 505.097V486.78C1507.77 479.802 1502.11 474.146 1495.13 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1905"
                  d="M1621.6 474.146H1554.91C1547.93 474.146 1542.28 479.802 1542.28 486.78V505.097C1542.28 512.074 1547.93 517.731 1554.91 517.731H1621.6C1628.58 517.731 1634.24 512.074 1634.24 505.097V486.78C1634.24 479.802 1628.58 474.146 1621.6 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1907"
                  d="M1748.09 474.146H1681.4C1674.42 474.146 1668.77 479.802 1668.77 486.78V505.097C1668.77 512.074 1674.42 517.731 1681.4 517.731H1748.09C1755.07 517.731 1760.73 512.074 1760.73 505.097V486.78C1760.73 479.802 1755.07 474.146 1748.09 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1923"
                  d="M1873.7 474.146H1807.01C1800.03 474.146 1794.37 479.802 1794.37 486.78V505.097C1794.37 512.074 1800.03 517.731 1807.01 517.731H1873.7C1880.68 517.731 1886.33 512.074 1886.33 505.097V486.78C1886.33 479.802 1880.68 474.146 1873.7 474.146Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.196037"
                />
                <path
                  id="rect1925"
                  d="M1872.57 611.268H1808.52C1801.06 611.268 1795.01 617.315 1795.01 624.775V675.555C1795.01 683.015 1801.06 689.062 1808.52 689.062H1872.57C1880.03 689.062 1886.08 683.015 1886.08 675.555V624.775C1886.08 617.315 1880.03 611.268 1872.57 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="rect1927"
                  d="M1967.22 474.035H1927.81C1920.8 474.035 1915.11 479.721 1915.11 486.735V505.148C1915.11 512.162 1920.8 517.849 1927.81 517.849H1967.22C1974.23 517.849 1979.92 512.162 1979.92 505.148V486.735C1979.92 479.721 1974.23 474.035 1967.22 474.035Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1929"
                  d="M1965.41 611.113H1929.5C1921.63 611.113 1915.25 617.492 1915.25 625.361V674.963C1915.25 682.831 1921.63 689.21 1929.5 689.21H1965.41C1973.28 689.21 1979.66 682.831 1979.66 674.963V625.361C1979.66 617.492 1973.28 611.113 1965.41 611.113Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.219605"
                />
                <path
                  id="path1076"
                  d="M760.643 521.977L806.755 596.928V698.689L760.643 625.999V521.977Z"
                  fill="#003674"
                />
                <path
                  id="rect1943"
                  d="M876.181 611.113H840.272C832.403 611.113 826.024 617.492 826.024 625.361V674.963C826.024 682.831 832.403 689.21 840.272 689.21H876.181C884.05 689.21 890.429 682.831 890.429 674.963V625.361C890.429 617.492 884.05 611.113 876.181 611.113Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.219605"
                />
                <path
                  id="rect5637"
                  d="M737.315 515.668H627.746V691.872H737.315V515.668Z"
                  fill="#FFAE01"
                  stroke="#4D4D4D"
                  strokeWidth="0.160927"
                />
                <path
                  id="rect5641"
                  d="M576.595 517.384H520.915V682.598H576.595V517.384Z"
                  fill="#FFAE01"
                  stroke="#4D4D4D"
                  strokeWidth="0.165"
                />
                <path
                  id="rect5647"
                  d="M576.815 680.379H520.733V701.243H576.815V680.379Z"
                  fill="#313131"
                  stroke="#4D4D4D"
                  strokeWidth="0.0588466"
                />
                <path
                  id="path1140"
                  d="M413.186 708.564H388.541V723.853H425.052L413.186 708.564Z"
                  fill="#161616"
                  stroke="#161616"
                  strokeWidth="0.264583"
                />
                <path
                  id="path1142"
                  d="M388.826 700.971C388.826 700.971 387 709.643 387 716.489C387 723.335 389.054 730.637 389.054 730.637"
                  stroke="#141414"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1158"
                  d="M553.066 539.544H544.465C539.121 539.544 534.789 543.876 534.789 549.22V600.826C534.789 606.17 539.121 610.502 544.465 610.502H553.066C558.41 610.502 562.742 606.17 562.742 600.826V549.22C562.742 543.876 558.41 539.544 553.066 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <g id="path1160">
                  <path d="M682.436 691.648V515.606V691.648Z" fill="#FFAE01" />
                  <path
                    d="M682.436 691.648V515.606"
                    stroke="#4D4D4D"
                    strokeWidth="0.160602"
                  />
                </g>
                <path
                  id="rect1162"
                  d="M659.433 539.544H650.832C645.488 539.544 641.156 543.876 641.156 549.22V600.826C641.156 606.17 645.488 610.502 650.832 610.502H659.433C664.777 610.502 669.109 606.17 669.109 600.826V549.22C669.109 543.876 664.777 539.544 659.433 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1164"
                  d="M714.938 539.544H706.337C700.993 539.544 696.661 543.876 696.661 549.22V600.826C696.661 606.17 700.993 610.502 706.337 610.502H714.938C720.281 610.502 724.614 606.17 724.614 600.826V549.22C724.614 543.876 720.281 539.544 714.938 539.544Z"
                  fill="#5C7BA3"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <path
                  id="circle1180"
                  d="M552.164 766.739C568.266 766.739 581.318 753.686 581.318 737.585C581.318 721.484 568.266 708.432 552.164 708.432C536.063 708.432 523.011 721.484 523.011 737.585C523.011 753.686 536.063 766.739 552.164 766.739Z"
                  fill="#2D2D2D"
                  stroke="#4B4B4B"
                  strokeWidth="0.527318"
                />
                <path
                  id="circle1182"
                  d="M744.019 766.739C760.12 766.739 773.173 753.686 773.173 737.585C773.173 721.484 760.12 708.432 744.019 708.432C727.918 708.432 714.865 721.484 714.865 737.585C714.865 753.686 727.918 766.739 744.019 766.739Z"
                  fill="#2D2D2D"
                  stroke="#4B4B4B"
                  strokeWidth="0.527318"
                />
                <path
                  id="rect1200"
                  d="M737.854 692.369H627.069V703.689H737.854V692.369Z"
                  fill="#282828"
                />
                <path
                  id="rect1080"
                  d="M415.678 658.258H413.463C412.08 658.258 410.959 659.379 410.959 660.761V672.859C410.959 674.242 412.08 675.363 413.463 675.363H415.678C417.06 675.363 418.181 674.242 418.181 672.859V660.761C418.181 659.379 417.06 658.258 415.678 658.258Z"
                  fill="#FFAE01"
                />
                <path
                  id="path1082"
                  d="M1054.95 569.495L1046.17 560.703L1054.92 551.989L1063.67 543.274L1074.94 543.318L1086.21 543.363L1087.05 543.665C1088.07 544.032 1089 544.494 1089.74 545.004C1090.05 545.214 1092.9 547.961 1096.09 551.108C1100.71 555.667 1102 556.872 1102.44 557.04C1102.94 557.229 1103.98 557.247 1112.56 557.216L1122.12 557.179L1115.27 550.268L1108.43 543.358L1113.4 543.321L1118.37 543.284L1127.01 551.937C1131.76 556.696 1135.62 560.647 1135.6 560.717C1135.58 560.783 1131.69 564.774 1126.98 569.576L1118.4 578.308L1107.08 578.264L1095.77 578.22L1094.73 577.871C1092.91 577.257 1091.5 576.263 1089.5 574.186C1088.83 573.494 1086.47 571.088 1084.25 568.839C1081.04 565.596 1080.1 564.707 1079.66 564.541C1079.16 564.356 1078.08 564.336 1069.43 564.368L1059.75 564.405L1066.63 571.348L1073.51 578.291H1068.62H1063.73L1054.95 569.495ZM1118.77 567.793L1122.12 564.402L1118.37 564.316C1116.31 564.272 1111.78 564.224 1108.31 564.224C1101.16 564.209 1101.14 564.209 1099.09 563.219L1097.88 562.642L1091.87 556.74C1088.57 553.493 1085.65 550.707 1085.39 550.547L1084.92 550.257L1075.67 550.256L1066.43 550.255L1063.08 553.71L1059.74 557.166L1060.9 557.202C1061.53 557.217 1066.24 557.289 1071.35 557.34L1080.65 557.443L1081.76 557.857C1082.37 558.084 1083.2 558.492 1083.61 558.762C1084.03 559.035 1086.87 561.722 1090 564.805C1093.1 567.858 1095.83 570.499 1096.07 570.672C1096.67 571.114 1097.14 571.136 1106.95 571.16L1115.42 571.175L1118.77 567.793Z"
                  fill="#003474"
                />
                <path
                  id="2"
                  d="M1893.24 606.557H1890.94V606.236L1892.15 604.886C1892.33 604.682 1892.46 604.516 1892.53 604.389C1892.59 604.261 1892.63 604.128 1892.63 603.991C1892.63 603.808 1892.57 603.658 1892.46 603.54C1892.35 603.423 1892.2 603.364 1892.02 603.364C1891.8 603.364 1891.62 603.428 1891.5 603.555C1891.38 603.68 1891.32 603.855 1891.32 604.08H1890.87C1890.87 603.757 1890.97 603.496 1891.18 603.297C1891.39 603.097 1891.67 602.998 1892.02 602.998C1892.35 602.998 1892.6 603.084 1892.79 603.256C1892.98 603.426 1893.08 603.654 1893.08 603.938C1893.08 604.284 1892.86 604.695 1892.42 605.173L1891.48 606.193H1893.24V606.557Z"
                  fill="white"
                />
                <path
                  id="2_2"
                  d="M1892.5 467.917H1890.2V467.596L1891.42 466.246C1891.6 466.041 1891.72 465.876 1891.79 465.749C1891.86 465.62 1891.89 465.487 1891.89 465.351C1891.89 465.168 1891.84 465.017 1891.72 464.9C1891.61 464.783 1891.47 464.724 1891.28 464.724C1891.06 464.724 1890.89 464.787 1890.76 464.914C1890.64 465.04 1890.58 465.215 1890.58 465.44H1890.13C1890.13 465.117 1890.24 464.856 1890.44 464.656C1890.65 464.457 1890.93 464.357 1891.28 464.357C1891.61 464.357 1891.87 464.443 1892.06 464.615C1892.24 464.786 1892.34 465.013 1892.34 465.298C1892.34 465.643 1892.12 466.055 1891.68 466.533L1890.74 467.553H1892.5V467.917Z"
                  fill="white"
                />
                <path
                  id="rect1092"
                  d="M1746.99 611.268H1682.94C1675.48 611.268 1669.43 617.315 1669.43 624.775V675.555C1669.43 683.015 1675.48 689.062 1682.94 689.062H1746.99C1754.45 689.062 1760.5 683.015 1760.5 675.555V624.775C1760.5 617.315 1754.45 611.268 1746.99 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="rect1094"
                  d="M1620.52 611.268H1556.47C1549.01 611.268 1542.96 617.315 1542.96 624.775V675.555C1542.96 683.015 1549.01 689.062 1556.47 689.062H1620.52C1627.98 689.062 1634.02 683.015 1634.02 675.555V624.775C1634.02 617.315 1627.98 611.268 1620.52 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="rect1096"
                  d="M1493.93 611.268H1429.88C1422.42 611.268 1416.37 617.315 1416.37 624.775V675.555C1416.37 683.015 1422.42 689.062 1429.88 689.062H1493.93C1501.39 689.062 1507.44 683.015 1507.44 675.555V624.775C1507.44 617.315 1501.39 611.268 1493.93 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="rect1098"
                  d="M1122.18 611.268H1058.13C1050.67 611.268 1044.62 617.315 1044.62 624.775V675.555C1044.62 683.015 1050.67 689.062 1058.13 689.062H1122.18C1129.64 689.062 1135.69 683.015 1135.69 675.555V624.775C1135.69 617.315 1129.64 611.268 1122.18 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="rect1100"
                  d="M999.203 611.268H935.151C927.691 611.268 921.643 617.315 921.643 624.775V675.555C921.643 683.015 927.691 689.062 935.151 689.062H999.203C1006.66 689.062 1012.71 683.015 1012.71 675.555V624.775C1012.71 617.315 1006.66 611.268 999.203 611.268Z"
                  fill="#5C7BA3"
                  stroke="#4D4D4D"
                  strokeWidth="0.260628"
                />
                <path
                  id="1"
                  d="M896.332 606.016H895.884V603.043L894.984 603.373V602.968L896.262 602.488H896.332V606.016Z"
                  fill="white"
                />
                <path
                  id="1_2"
                  d="M895.805 469.477H895.356V466.504L894.457 466.834V466.429L895.735 465.949H895.805V469.477Z"
                  fill="white"
                />
                <path
                  id="path1132"
                  d="M697.686 610.652L683.107 596.073V625.231L697.686 610.652Z"
                  fill="white"
                />
                <path
                  id="path1134"
                  d="M667.331 610.652L681.909 596.073V625.231L667.331 610.652Z"
                  fill="white"
                />
                <path
                  id="circle1136"
                  d="M747.863 615.092C750.091 615.092 751.897 613.286 751.897 611.058C751.897 608.83 750.091 607.024 747.863 607.024C745.635 607.024 743.829 608.83 743.829 611.058C743.829 613.286 745.635 615.092 747.863 615.092Z"
                  fill="#4B4B4B"
                />
                <path
                  id="circle1138"
                  d="M747.894 614.45C749.766 614.45 751.283 612.933 751.283 611.061C751.283 609.19 749.766 607.673 747.894 607.673C746.023 607.673 744.506 609.19 744.506 611.061C744.506 612.933 746.023 614.45 747.894 614.45Z"
                  fill="#E7E7E7"
                />
                <path
                  id="circle1140"
                  d="M747.918 612.228C748.564 612.228 749.088 611.704 749.088 611.058C749.088 610.412 748.564 609.888 747.918 609.888C747.272 609.888 746.748 610.412 746.748 611.058C746.748 611.704 747.272 612.228 747.918 612.228Z"
                  fill="#000D58"
                />
                <path
                  id="rect1085"
                  d="M1390.25 616.562H1285.9V677.513H1390.25V616.562Z"
                  fill="#363636"
                />
                <path
                  id="path1087"
                  d="M1289.89 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1089"
                  d="M1293.19 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1091"
                  d="M1296.49 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1093"
                  d="M1299.79 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1095"
                  d="M1303.08 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1097"
                  d="M1306.38 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1099"
                  d="M1309.68 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1101"
                  d="M1312.98 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1103"
                  d="M1316.28 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1105"
                  d="M1319.69 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1107"
                  d="M1323 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1109"
                  d="M1326.3 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1111"
                  d="M1329.6 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1113"
                  d="M1332.9 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1115"
                  d="M1336.2 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1117"
                  d="M1339.49 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1119"
                  d="M1342.8 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1121"
                  d="M1346.09 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1123"
                  d="M1349.39 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1125"
                  d="M1352.69 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1127"
                  d="M1355.99 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1129"
                  d="M1359.29 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1131"
                  d="M1362.59 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1133"
                  d="M1365.89 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1135"
                  d="M1369.2 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1137"
                  d="M1372.6 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1139"
                  d="M1375.91 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1141"
                  d="M1379.21 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1143"
                  d="M1382.51 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1145"
                  d="M1385.81 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1147"
                  d="M1286.59 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1149"
                  d="M1389.1 616.907V676.729"
                  stroke="#2B2B2B"
                  strokeWidth="0.065"
                />
                <path
                  id="path1151"
                  d="M514.99 659.674V578.665"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <path
                  id="path1153"
                  d="M581.948 659.674V578.665"
                  stroke="#4B4B4B"
                  strokeWidth="0.165"
                />
                <path
                  id="rect1146"
                  d="M2030.78 731.695H779.574L795.995 753.811H2014.91L2030.78 731.695Z"
                  fill="#4B4B4B"
                />
              </g>
            </g>
            <rect
              id="perron"
              y="727.75"
              width="1920"
              height="352.25"
              fill="url(#paint1_linear_92:39)"
            />
            <g
              ref={this.trainShadow}
              className={styles.train_shadow}
              id="train-shadow"
            >
              <path
                id="path1891_2"
                d="M420.494 759.68L445.561 846.707L482.13 913.751C482.13 913.751 480.453 933.23 542.523 949.931C604.592 966.631 653.882 966.631 653.882 966.631L2518.6 966.632L2371.55 727.681H2013.93H796.277H412.907L420.494 759.68Z"
                fill="url(#paint2_linear_92:39)"
              />
            </g>
            <g id="info-screen">
              <path
                id="screen_shadow"
                d="M252.018 865.22C276.156 858.828 292.021 915.51 339.517 997.777C387.014 1080.04 504.568 1339.75 494.906 1345.33C485.245 1350.91 359.657 1107.19 312.16 1024.93C264.664 942.659 242.504 894.503 252.018 865.22Z"
                fill="black"
                fillOpacity="0.2"
              />
              <path
                id="Vector_107"
                d="M272.773 557.874H255.737V892.918H272.773V557.874Z"
                fill="#3F3D56"
              />
              <path
                id="Vector_108"
                d="M285.549 857.396H242.959V892.918H285.549V857.396Z"
                fill="#D0CDE1"
              />
              <path
                id="Vector_109"
                d="M365.975 417.187H170.384C169.004 417.187 167.68 417.704 166.704 418.625C165.728 419.545 165.18 420.793 165.18 422.095V534.562H371.18V422.095C371.18 420.793 370.631 419.545 369.655 418.625C368.679 417.704 367.356 417.187 365.975 417.187Z"
                fill="#3F3D56"
              />
              <path
                id="Vector_110"
                d="M167.18 552.966V536.562H369.18V552.966C369.18 553.698 368.872 554.426 368.283 554.981C367.69 555.541 366.862 555.874 365.975 555.874H170.384C169.497 555.874 168.669 555.541 168.076 554.981C167.487 554.426 167.18 553.698 167.18 552.966Z"
                fill="#FFAE01"
                stroke="#3F3D56"
                strokeWidth="4"
              />
              <g id="screen">
                <path
                  ref={this.screenBackground}
                  className={styles.screen_background}
                  id="screen_background"
                  d="M361.205 427.412H175.588V525.565H361.205V427.412Z"
                  fill="white"
                />
                <g
                  ref={this.screenInfo}
                  className={styles.screen_info}
                  id="screen_info"
                >
                  <path
                    id="Vector_111"
                    d="M285.829 455.118H235.781V457.827H285.829V455.118Z"
                    fill="#3F3D56"
                  />
                  <path
                    id="Vector_112"
                    d="M313.066 465H235.781V467.71H313.066V465Z"
                    fill="#536DFE"
                  />
                  <path
                    id="Vector_113"
                    d="M298.767 474.311H235.781V477.02H298.767V474.311Z"
                    fill="#536DFE"
                  />
                  <path
                    id="Vector_114"
                    d="M272.551 483.587H235.781V486.296H272.551V483.587Z"
                    fill="#3F3D56"
                  />
                  <path
                    id="Vector_115"
                    d="M291.277 492.862H235.781V495.572H291.277V492.862Z"
                    fill="#3F3D56"
                  />
                  <path
                    id="Vector_116"
                    d="M219.099 454.155H212.971V459.934H219.099V454.155Z"
                    fill="#3F3D56"
                  />
                  <path
                    id="Vector_117"
                    d="M219.099 463.466H212.971V469.245H219.099V463.466Z"
                    fill="#536DFE"
                  />
                  <path
                    id="Vector_118"
                    d="M219.099 472.776H212.971V478.556H219.099V472.776Z"
                    fill="#536DFE"
                  />
                  <path
                    id="Vector_119"
                    d="M219.099 482.087H212.971V487.866H219.099V482.087Z"
                    fill="#3F3D56"
                  />
                  <path
                    id="Vector_120"
                    d="M219.099 491.398H212.971V497.177H219.099V491.398Z"
                    fill="#3F3D56"
                  />
                </g>
              </g>
              <g
                id="submit_flag_1"
                onClick={() => this.openFlagSubmitModal(1)}
                ref={this.flagOneButton}
                className={styles.flag_button}
              >
                <rect
                  id="Rectangle 27"
                  x="300"
                  y="398.209"
                  width="135"
                  height="47.581"
                  rx="9"
                  fill={`${this.getFillColor(1)}`}
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  id="Vector_121"
                  d="M335.656 425.425H333.617C333.347 425.425 333.087 425.532 332.896 425.724C332.705 425.915 332.598 426.174 332.598 426.444V433.58H312.211V413.193H321.385C321.655 413.193 321.914 413.085 322.106 412.894C322.297 412.703 322.404 412.444 322.404 412.174V410.135C322.404 409.864 322.297 409.605 322.106 409.414C321.914 409.223 321.655 409.115 321.385 409.115H311.191C310.38 409.115 309.602 409.438 309.029 410.011C308.455 410.585 308.133 411.362 308.133 412.174V434.599C308.133 435.41 308.455 436.188 309.029 436.761C309.602 437.335 310.38 437.657 311.191 437.657H333.617C334.428 437.657 335.206 437.335 335.779 436.761C336.353 436.188 336.675 435.41 336.675 434.599V426.444C336.675 426.174 336.568 425.915 336.376 425.724C336.185 425.532 335.926 425.425 335.656 425.425ZM339.223 405.038H331.069C329.707 405.038 329.027 406.689 329.986 407.65L332.262 409.926L316.734 425.449C316.591 425.591 316.478 425.759 316.401 425.945C316.324 426.131 316.284 426.33 316.284 426.532C316.284 426.733 316.324 426.932 316.401 427.118C316.478 427.304 316.591 427.473 316.734 427.615L318.178 429.056C318.32 429.199 318.489 429.312 318.675 429.389C318.861 429.466 319.06 429.506 319.261 429.506C319.463 429.506 319.662 429.466 319.848 429.389C320.034 429.312 320.202 429.199 320.344 429.056L335.865 413.532L338.14 415.805C339.096 416.761 340.752 416.092 340.752 414.722V406.567C340.752 406.162 340.591 405.773 340.305 405.486C340.018 405.199 339.629 405.038 339.223 405.038V405.038Z"
                  fill="white"
                />
                <path
                  id="Flag 1"
                  d="M366.572 424.094H359.259V431.647H355.45V413.163H367.486V416.248H359.259V421.021H366.572V424.094ZM373.325 431.647H369.644V412.147H373.325V431.647ZM384.32 431.647C384.15 431.317 384.028 430.907 383.951 430.416C383.063 431.406 381.907 431.901 380.486 431.901C379.14 431.901 378.023 431.512 377.134 430.733C376.254 429.955 375.814 428.973 375.814 427.788C375.814 426.332 376.351 425.215 377.426 424.437C378.509 423.658 380.071 423.264 382.111 423.256H383.799V422.469C383.799 421.834 383.634 421.326 383.304 420.945C382.982 420.564 382.47 420.374 381.768 420.374C381.15 420.374 380.663 420.522 380.308 420.818C379.961 421.115 379.787 421.521 379.787 422.037H376.118C376.118 421.242 376.364 420.505 376.855 419.828C377.346 419.151 378.04 418.622 378.937 418.241C379.834 417.852 380.841 417.657 381.958 417.657C383.651 417.657 384.992 418.085 385.983 418.939C386.981 419.786 387.481 420.979 387.481 422.52V428.474C387.489 429.777 387.671 430.763 388.027 431.432V431.647H384.32ZM381.285 429.096C381.827 429.096 382.326 428.977 382.783 428.74C383.24 428.495 383.579 428.169 383.799 427.763V425.401H382.428C380.591 425.401 379.614 426.036 379.495 427.306L379.483 427.521C379.483 427.979 379.643 428.355 379.965 428.651C380.287 428.948 380.727 429.096 381.285 429.096ZM389.766 424.678C389.766 422.57 390.265 420.873 391.264 419.587C392.271 418.3 393.625 417.657 395.326 417.657C396.833 417.657 398.005 418.174 398.843 419.206L398.995 417.911H402.322V431.19C402.322 432.392 402.046 433.438 401.496 434.326C400.955 435.215 400.189 435.892 399.198 436.357C398.208 436.823 397.049 437.056 395.72 437.056C394.713 437.056 393.731 436.853 392.775 436.446C391.818 436.049 391.095 435.532 390.604 434.897L392.229 432.663C393.143 433.687 394.252 434.199 395.555 434.199C396.528 434.199 397.286 433.937 397.827 433.412C398.369 432.896 398.64 432.16 398.64 431.203V430.467C397.794 431.423 396.681 431.901 395.301 431.901C393.651 431.901 392.313 431.258 391.289 429.972C390.274 428.677 389.766 426.963 389.766 424.83V424.678ZM393.435 424.944C393.435 426.188 393.684 427.166 394.184 427.877C394.683 428.579 395.369 428.931 396.24 428.931C397.358 428.931 398.157 428.512 398.64 427.674V421.897C398.149 421.06 397.358 420.641 396.266 420.641C395.386 420.641 394.692 421 394.184 421.72C393.684 422.439 393.435 423.514 393.435 424.944ZM420.387 431.647H416.718V417.505L412.338 418.863V415.88L419.993 413.138H420.387V431.647Z"
                  fill="white"
                />
              </g>
            </g>
            <g id="person">
              <g id="person 2">
                <path
                  id="Path 2996"
                  d="M1690.05 834.886C1690.6 834.811 1691.13 834.588 1691.59 834.233C1692.06 833.879 1692.46 833.4 1692.77 832.832C1693.07 832.264 1693.27 831.62 1693.36 830.946C1693.44 830.271 1693.4 829.582 1693.25 828.928L1704.11 819.285L1697.64 816.188L1688.31 825.819C1687.44 826.215 1686.72 826.994 1686.29 828.007C1685.85 829.019 1685.73 830.196 1685.94 831.314C1686.16 832.432 1686.69 833.413 1687.45 834.071C1688.21 834.729 1689.14 835.019 1690.05 834.886H1690.05Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 2997"
                  d="M1696.09 828.535L1692.48 820.885L1692.56 820.777L1707.1 800.207L1718.39 776.283L1728.19 777.835L1728.34 781.517L1728.31 781.572L1712.73 810.667L1712.72 810.684L1696.09 828.535Z"
                  fill="#3F3D56"
                />
                <path
                  id="Path 2998"
                  d="M1744.13 957.961H1738.58L1735.95 931.388H1744.13L1744.13 957.961Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 2999"
                  d="M1745.54 964.639H1727.66V964.357C1727.67 962.065 1728.4 959.867 1729.7 958.246C1731.01 956.625 1732.78 955.714 1734.62 955.714H1745.54L1745.54 964.639Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3000"
                  d="M1696.41 957.736L1691.02 956.135L1693.42 929.528L1701.38 931.889L1696.41 957.736Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3001"
                  d="M1696.54 964.639L1679.15 959.479L1679.2 959.206C1679.63 956.976 1680.76 955.048 1682.33 953.848C1683.9 952.647 1685.79 952.272 1687.59 952.804L1698.21 955.955L1696.54 964.639Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3002"
                  d="M1717.96 764.136V752.539C1717.96 748.418 1719.28 744.465 1721.62 741.551C1723.97 738.637 1727.15 737 1730.46 737C1733.78 737 1736.96 738.637 1739.31 741.551C1741.65 744.465 1742.97 748.418 1742.97 752.539V764.136C1742.97 764.689 1742.79 765.219 1742.48 765.61C1742.16 766.001 1741.74 766.221 1741.29 766.222H1719.64C1719.19 766.221 1718.77 766.001 1718.45 765.61C1718.14 765.219 1717.96 764.689 1717.96 764.136V764.136Z"
                  fill="#2F2E41"
                />
                <path
                  id="Ellipse 572"
                  d="M1727.38 766.047C1732.44 766.047 1736.55 760.946 1736.55 754.654C1736.55 748.362 1732.44 743.261 1727.38 743.261C1722.31 743.261 1718.21 748.362 1718.21 754.654C1718.21 760.946 1722.31 766.047 1727.38 766.047Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3003"
                  d="M1715 753.467C1715 750.208 1716.05 747.083 1717.9 744.779C1719.76 742.474 1722.27 741.178 1724.89 741.175H1726.76C1729.38 741.178 1731.9 742.474 1733.75 744.779C1735.61 747.083 1736.65 750.208 1736.65 753.467V753.699H1732.71L1731.36 749.018L1731.09 753.699H1729.05L1728.37 751.337L1728.24 753.699H1715V753.467Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3004"
                  d="M1732.72 814.784L1709.38 813.68L1708.08 794.703C1707.07 791.23 1707.05 788.245 1708.03 785.839C1708.87 783.861 1710.27 782.349 1711.97 781.605L1717.08 773.939C1717.73 772.954 1718.56 772.162 1719.49 771.621C1720.43 771.08 1721.44 770.804 1722.47 770.812L1735.75 770.925C1736.07 770.686 1738.01 769.46 1741.84 771.521C1745.99 773.757 1745.02 781.523 1745.01 781.601L1745 781.674L1744.96 781.724L1736.13 790.964L1732.72 814.784Z"
                  fill="#3F3D56"
                />
                <path
                  id="Path 3005"
                  d="M1709.57 811.641L1698.53 836.657L1690.15 950.466L1699.61 954.056L1716.36 865.026L1735.79 951.53L1747.13 951.881L1739.41 852.056L1732.66 813.407L1709.57 811.641Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3006"
                  d="M1712.83 819.15C1712.6 818.909 1712.35 819.317 1712.27 820.06L1709.97 842.614C1709.9 843.359 1710.03 844.154 1710.26 844.398L1738.82 873.872C1739.06 874.112 1739.31 873.705 1739.38 872.961L1741.68 850.408C1741.76 849.663 1741.63 848.868 1741.39 848.625L1712.83 819.15Z"
                  fill="#536DFE"
                />
                <path
                  id="Path 3011"
                  d="M1739.07 852.14C1739.48 851.684 1739.8 851.122 1740.02 850.494C1740.23 849.866 1740.33 849.188 1740.31 848.506C1740.29 847.824 1740.16 847.155 1739.91 846.547C1739.66 845.939 1739.3 845.406 1738.87 844.986L1743.18 829.286L1736.47 831.454L1733.4 846.03C1732.88 846.98 1732.66 848.135 1732.78 849.275C1732.9 850.414 1733.35 851.46 1734.05 852.213C1734.75 852.967 1735.65 853.375 1736.57 853.362C1737.5 853.348 1738.39 852.914 1739.07 852.14L1739.07 852.14Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3012"
                  d="M1740.99 842.612L1734.48 839.003L1736.67 811.615L1734.63 783.998L1743.33 778.163L1745.17 781.051V781.117L1746.15 816.04L1746.14 816.066L1740.99 842.612Z"
                  fill="#3F3D56"
                />
              </g>
              <ellipse
                id="Ellipse 598"
                cx="1706.65"
                cy="965"
                rx="62.5"
                ry="13"
                fill="url(#paint3_radial_92:39)"
                fillOpacity="0.57"
              />
            </g>
            <g id="person_2">
              <g id="person 2_2">
                <path
                  id="Path 2996_2"
                  d="M436.426 852.169C435.85 852.094 435.294 851.871 434.799 851.516C434.303 851.161 433.88 850.683 433.559 850.115C433.237 849.547 433.026 848.903 432.938 848.229C432.851 847.554 432.891 846.865 433.054 846.21L421.582 836.568L428.419 833.47L438.265 843.102C439.182 843.498 439.943 844.276 440.404 845.289C440.866 846.302 440.995 847.479 440.769 848.597C440.542 849.714 439.975 850.695 439.174 851.354C438.374 852.012 437.396 852.302 436.426 852.169H436.426Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 2997_2"
                  d="M430.055 845.818L433.861 838.168L433.78 838.059L418.425 817.489L406.503 793.565L396.15 795.118L395.997 798.8L396.028 798.855L412.476 827.949L412.493 827.967L430.055 845.818Z"
                  fill="#3222EA"
                />
                <path
                  id="Path 2998_2"
                  d="M379.324 975.243H385.178L387.964 948.671H379.323L379.324 975.243Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 2999_2"
                  d="M377.831 981.922H396.709V981.64C396.708 979.348 395.934 977.15 394.557 975.529C393.179 973.908 391.311 972.997 389.363 972.997H377.832L377.831 981.922Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3000_2"
                  d="M429.712 975.018L435.406 973.418L432.871 946.811L424.466 949.172L429.712 975.018Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3001_2"
                  d="M429.578 981.921L447.94 976.762L447.884 976.489C447.432 974.258 446.245 972.331 444.584 971.13C442.924 969.93 440.926 969.555 439.031 970.087L427.816 973.238L429.578 981.921Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3002_2"
                  d="M406.958 781.418V769.822C406.958 765.701 405.566 761.748 403.09 758.834C400.613 755.92 397.254 754.283 393.752 754.283C390.249 754.283 386.89 755.92 384.414 758.834C381.937 761.748 380.546 765.701 380.546 769.822V781.418C380.547 781.971 380.734 782.502 381.066 782.893C381.399 783.284 381.849 783.504 382.319 783.505H405.184C405.654 783.504 406.105 783.284 406.437 782.893C406.77 782.502 406.957 781.972 406.958 781.418V781.418Z"
                  fill="#EFB00F"
                />
                <path
                  id="Ellipse 572_2"
                  d="M397.011 783.33C391.663 783.33 387.329 778.229 387.329 771.937C387.329 765.645 391.663 760.544 397.011 760.544C402.358 760.544 406.693 765.645 406.693 771.937C406.693 778.229 402.358 783.33 397.011 783.33Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3003_2"
                  d="M410.082 770.749C410.079 767.49 408.977 764.366 407.019 762.062C405.061 759.757 402.405 758.461 399.636 758.457H397.665C394.895 758.461 392.24 759.757 390.281 762.062C388.323 764.366 387.221 767.49 387.218 770.749V770.981H391.384L392.804 766.3L393.089 770.981H395.242L395.959 768.62L396.103 770.981H410.082V770.749Z"
                  fill="#EFB00F"
                />
                <path
                  id="Path 3004_2"
                  d="M391.365 832.066L416.017 830.963L417.395 811.986C418.458 808.513 418.475 805.528 417.446 803.122C416.561 801.144 415.074 799.632 413.283 798.888L407.889 791.222C407.195 790.236 406.324 789.445 405.338 788.904C404.352 788.363 403.277 788.087 402.19 788.095L388.173 788.208C387.836 787.969 385.786 786.743 381.745 788.804C377.361 791.039 378.379 798.806 378.39 798.884L378.4 798.957L378.448 799.006L387.771 808.246L391.365 832.066Z"
                  fill="#3222EA"
                />
                <path
                  id="Path 3005_2"
                  d="M415.819 828.923L427.479 853.94L436.32 967.749L426.331 971.339L408.651 882.309L388.133 968.813L376.157 969.164L384.31 869.338L391.435 830.69L415.819 828.923Z"
                  fill="#747386"
                />
                <path
                  id="Path 3011_2"
                  d="M384.665 869.422C384.234 868.966 383.893 868.404 383.666 867.777C383.439 867.149 383.331 866.47 383.351 865.788C383.371 865.106 383.518 864.438 383.781 863.83C384.044 863.222 384.417 862.689 384.874 862.269L380.322 846.568L387.415 848.736L390.647 863.312C391.196 864.263 391.43 865.417 391.304 866.557C391.177 867.697 390.7 868.743 389.963 869.496C389.225 870.249 388.278 870.658 387.301 870.644C386.325 870.631 385.386 870.196 384.664 869.423L384.665 869.422Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3012_2"
                  d="M382.632 859.894L389.513 856.286L387.201 828.898L389.354 801.28L380.167 795.446L378.22 798.334V798.4L377.189 833.322L377.194 833.349L382.632 859.894Z"
                  fill="#210FEB"
                />
              </g>
              <g id="person_shadow" opacity="0.23">
                <path
                  id="Path 2999_3"
                  d="M378.007 981.337H396.439V981.554C396.438 983.326 395.683 985.025 394.338 986.278C392.993 987.531 391.169 988.235 389.267 988.235H378.008L378.007 981.337Z"
                  fill="black"
                />
                <path
                  id="Path 3001_3"
                  d="M429.504 980.793L447.77 975.693L447.863 975.955C448.628 978.096 448.612 980.358 447.82 982.244C447.027 984.13 445.523 985.486 443.637 986.013L432.482 989.128L429.504 980.793Z"
                  fill="black"
                />
                <path
                  id="Path 3005_3"
                  d="M418.534 1095.95L450.007 1081.47L445.042 984.353L432.628 986.333L426.669 1064.14L389.428 986.333H378.007L407.8 1090.13L401.842 1095.95H418.534Z"
                  fill="url(#paint4_linear_92:39)"
                />
              </g>
            </g>
            <g id="person_3">
              <g id="person 4">
                <path
                  id="Vector_121"
                  d="M864.57 809.124C864.57 809.124 860.701 830.846 865.429 830.846C870.158 830.846 881.336 806.266 881.336 806.266L877.467 799.978L870.522 812.798L870.158 806.266L864.57 809.124Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_122"
                  d="M880.305 807.21C882.383 807.21 884.068 804.969 884.068 802.205C884.068 799.441 882.383 797.2 880.305 797.2C878.226 797.2 876.541 799.441 876.541 802.205C876.541 804.969 878.226 807.21 880.305 807.21Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_123"
                  d="M861.289 957.068L866.299 957.067L868.683 931.37L861.288 931.371L861.289 957.068Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_124"
                  d="M861.113 964.017L876.52 964.016V963.757C876.52 961.643 875.888 959.615 874.763 958.119C873.638 956.624 872.113 955.784 870.523 955.784H870.522L867.708 952.945L862.457 955.784L861.112 955.784L861.113 964.017Z"
                  fill="#2F2E41"
                />
                <path
                  id="Vector_125"
                  d="M807.396 948.756L811.878 951.73L822.641 930.153L816.025 925.763L807.396 948.756Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_126"
                  d="M805.068 953.269L818.829 962.439L818.915 962.207C819.624 960.31 819.74 958.115 819.237 956.104C818.734 954.093 817.653 952.432 816.233 951.485L816.232 951.485L814.671 947.264L809.029 946.685L807.828 945.884L805.068 953.269Z"
                  fill="#2F2E41"
                />
                <path
                  id="Vector_127"
                  d="M829.042 847.647C829.042 847.647 827.059 879.397 826.633 886.2C826.341 890.465 825.625 894.659 824.504 898.673C824.504 898.673 823.653 900.941 823.653 903.209L814.002 926.564C814.002 926.564 811.053 929.45 811.479 931.718C811.904 933.986 809.701 935.346 809.701 935.346L819.864 937.955C819.864 937.955 819.438 936.254 820.715 935.687C821.992 935.12 823.009 930.202 823.009 930.202L837.277 899.24L847.495 870.893C847.495 870.893 853.456 896.405 854.733 899.24C854.733 899.24 859.417 930.989 860.268 933.824C861.12 936.659 861.545 936.659 861.12 937.793C860.694 938.927 860.694 940.061 861.12 940.627C861.545 941.194 869.635 940.627 869.635 940.627L867.506 900.374L863.674 852.183L844.089 844.246L829.042 847.647Z"
                  fill="#2F2E41"
                />
                <path
                  id="Vector_128"
                  d="M848.258 772.111C853.244 772.111 857.286 766.736 857.286 760.106C857.286 753.477 853.244 748.102 848.258 748.102C843.272 748.102 839.23 753.477 839.23 760.106C839.23 766.736 843.272 772.111 848.258 772.111Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_129"
                  d="M864.424 789.341L853.785 780.757C853.785 780.757 853.49 775.426 850.458 775.176C848.937 775.05 846.653 774.857 843.226 774.563C842.501 774.501 842.013 779.778 841.183 779.706L829.952 783.673L831.655 822.212C831.655 822.212 829.101 837.514 829.952 840.348C830.803 843.181 827.825 844.315 828.676 844.882C829.527 845.448 828.676 849.416 828.676 849.416C828.676 849.416 845.273 860.75 863.572 852.249L861.87 844.882C862.102 843.918 862.145 842.893 861.996 841.901C861.847 840.909 861.511 839.985 861.019 839.214C861.019 839.214 862.721 835.814 860.593 832.98C860.593 832.98 861.445 827.879 859.317 825.612L858.891 817.678L860.168 813.711L864.424 789.341Z"
                  fill="#F3C4C4"
                />
                <path
                  id="Vector_130"
                  d="M840.458 766.862L840.208 766.085C840.175 765.985 837.006 755.976 839.815 749.802C841.116 746.944 843.48 745.331 846.843 745.007C852.104 744.499 855.705 746.166 857.549 749.959C857.858 750.602 858.032 751.344 858.052 752.108C858.072 752.872 857.938 753.628 857.663 754.299C857.389 754.969 856.984 755.528 856.492 755.917C855.999 756.306 855.438 756.511 854.866 756.51H854.795L853.828 754.833L853.772 754.996C853.422 756.008 852.618 756.561 851.677 756.44C851.517 756.425 851.375 756.609 851.261 757.005C851.223 757.177 851.15 757.333 851.051 757.456C850.952 757.578 850.83 757.663 850.698 757.701C850.003 757.882 849.011 756.711 848.567 756.128C848.55 756.262 848.512 756.39 848.454 756.503C848.397 756.615 848.322 756.71 848.235 756.781C847.767 757.142 847.04 756.671 846.831 756.521C845.166 756.993 844.089 756.867 843.627 756.146C843.314 759.103 842.643 764.427 841.837 764.722C841.753 764.748 841.665 764.737 841.586 764.691C841.507 764.645 841.441 764.566 841.398 764.466C841.204 764.129 841.03 763.962 840.922 764.009C840.66 764.12 840.506 765.273 840.483 766.017L840.458 766.862Z"
                  fill="#2F2E41"
                />
                <path
                  id="Vector_131"
                  d="M859.997 790.225L864.285 789.298C867.374 793.245 869.478 798.357 870.314 803.944C871.604 813.09 872.034 814.805 872.034 814.805L861.716 818.234L856.127 803.944L859.997 790.225Z"
                  fill="#F3C4C4"
                />
                <path
                  id="Vector_132"
                  d="M823.455 805.659C823.455 805.659 819.586 827.381 824.315 827.381C829.044 827.381 840.221 802.801 840.221 802.801L836.352 796.513L829.408 809.333L829.044 802.801L823.455 805.659Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_133"
                  d="M839.19 803.745C841.269 803.745 842.954 801.504 842.954 798.74C842.954 795.976 841.269 793.735 839.19 793.735C837.111 793.735 835.426 795.976 835.426 798.74C835.426 801.504 837.111 803.745 839.19 803.745Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_134"
                  d="M833.035 787.367L830.456 783.937C830.456 783.937 825.297 787.938 824.867 791.94C824.438 795.941 822.288 808.517 822.288 808.517L830.241 809.374L832.821 804.23L833.035 787.367Z"
                  fill="#F3C4C4"
                />
                <path
                  id="Vector_135"
                  d="M864.57 809.124C864.57 809.124 860.701 830.846 865.429 830.846C870.158 830.846 881.336 806.266 881.336 806.266L877.467 799.978L870.522 812.798L870.158 806.266L864.57 809.124Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_136"
                  d="M805.068 953.269L818.829 962.439L818.915 962.207C819.624 960.31 819.74 958.115 819.237 956.104C818.734 954.093 817.653 952.432 816.233 951.485L816.232 951.485L814.671 947.264L809.029 946.685L807.828 945.884L805.068 953.269Z"
                  fill="#2F2E41"
                />
                <path
                  id="Vector_137"
                  d="M829.042 847.647C829.042 847.647 827.059 879.397 826.633 886.2C826.341 890.465 825.625 894.659 824.504 898.673C824.504 898.673 823.653 900.941 823.653 903.209L814.002 926.564C814.002 926.564 811.053 929.45 811.479 931.718C811.904 933.986 809.701 935.346 809.701 935.346L819.864 937.955C819.864 937.955 819.438 936.254 820.715 935.687C821.992 935.12 823.009 930.202 823.009 930.202L837.277 899.24L847.495 870.893C847.495 870.893 853.456 896.405 854.733 899.24C854.733 899.24 859.417 930.989 860.268 933.824C861.12 936.659 861.545 936.659 861.12 937.793C860.694 938.927 860.694 940.061 861.12 940.627C861.545 941.194 869.635 940.627 869.635 940.627L867.506 900.374L863.674 852.183L844.089 844.246L829.042 847.647Z"
                  fill="#2F2E41"
                />
                <path
                  id="Vector_138"
                  d="M864.424 789.341L853.785 780.757C853.785 780.757 853.49 775.426 850.458 775.176C848.937 775.05 846.653 774.857 843.226 774.563C842.501 774.501 842.013 779.778 841.183 779.706L829.952 783.673L831.655 822.212C831.655 822.212 829.101 837.514 829.952 840.348C830.803 843.181 827.825 844.315 828.676 844.882C829.527 845.448 828.676 849.416 828.676 849.416C828.676 849.416 845.273 860.75 863.572 852.249L861.87 844.882C862.102 843.918 862.145 842.893 861.996 841.901C861.847 840.909 861.511 839.985 861.019 839.214C861.019 839.214 862.721 835.814 860.593 832.98C860.593 832.98 861.445 827.879 859.317 825.612L858.891 817.678L860.168 813.711L864.424 789.341Z"
                  fill="#F3C4C4"
                />
                <path
                  id="Vector_139"
                  d="M840.458 766.862L840.208 766.085C840.175 765.985 837.006 755.976 839.815 749.802C841.116 746.944 843.48 745.331 846.843 745.007C852.104 744.499 855.705 746.166 857.549 749.959C857.858 750.602 858.032 751.344 858.052 752.108C858.072 752.872 857.938 753.628 857.663 754.299C857.389 754.969 856.984 755.528 856.492 755.917C855.999 756.306 855.438 756.511 854.866 756.51H854.795L853.828 754.833L853.772 754.996C853.422 756.008 852.618 756.561 851.677 756.44C851.517 756.425 851.375 756.609 851.261 757.005C851.223 757.177 851.15 757.333 851.051 757.456C850.952 757.578 850.83 757.663 850.698 757.701C850.003 757.882 849.011 756.711 848.567 756.128C848.55 756.262 848.512 756.39 848.454 756.503C848.397 756.615 848.322 756.71 848.235 756.781C847.767 757.142 847.04 756.671 846.831 756.521C845.166 756.993 844.089 756.867 843.627 756.146C843.314 759.103 842.643 764.427 841.837 764.722C841.753 764.748 841.665 764.737 841.586 764.691C841.507 764.645 841.441 764.566 841.398 764.466C841.204 764.129 841.03 763.962 840.922 764.009C840.66 764.12 840.506 765.273 840.483 766.017L840.458 766.862Z"
                  fill="#2F2E41"
                />
                <path
                  id="Vector_140"
                  d="M859.997 790.225L864.285 789.298C867.374 793.245 869.478 798.357 870.314 803.944C871.604 813.09 872.034 814.805 872.034 814.805L861.716 818.234L856.127 803.944L859.997 790.225Z"
                  fill="#F3C4C4"
                />
                <path
                  id="Vector_141"
                  d="M823.455 805.659C823.455 805.659 819.586 827.381 824.315 827.381C829.044 827.381 840.221 802.801 840.221 802.801L836.352 796.513L829.408 809.333L829.044 802.801L823.455 805.659Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_142"
                  d="M839.19 803.745C841.269 803.745 842.954 801.504 842.954 798.74C842.954 795.976 841.269 793.735 839.19 793.735C837.111 793.735 835.426 795.976 835.426 798.74C835.426 801.504 837.111 803.745 839.19 803.745Z"
                  fill="#A0616A"
                />
                <path
                  id="Vector_143"
                  d="M833.035 787.367L830.456 783.937C830.456 783.937 825.297 787.938 824.867 791.94C824.438 795.941 822.288 808.517 822.288 808.517L830.241 809.374L832.821 804.23L833.035 787.367Z"
                  fill="#F3C4C4"
                />
              </g>
              <ellipse
                id="Ellipse 600"
                cx="843.568"
                cy="963.918"
                rx="62.5"
                ry="13"
                fill="url(#paint5_radial_92:39)"
                fillOpacity="0.57"
              />
            </g>
            <g id="person_4">
              <g id="person 2_3">
                <path
                  id="Path 2996_3"
                  d="M607.217 655.309C606.78 655.249 606.359 655.071 605.984 654.787C605.609 654.503 605.288 654.12 605.045 653.666C604.801 653.212 604.641 652.696 604.575 652.157C604.509 651.617 604.539 651.066 604.663 650.542L595.972 642.828L601.151 640.35L608.61 648.055C609.305 648.372 609.881 648.995 610.231 649.805C610.58 650.616 610.679 651.557 610.507 652.451C610.335 653.345 609.905 654.13 609.299 654.657C608.692 655.184 607.951 655.416 607.217 655.309H607.217Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 2997_3"
                  d="M602.391 650.228L605.274 644.108L605.213 644.021L593.58 627.565L584.548 608.426L576.705 609.668L576.589 612.614L576.613 612.658L589.073 635.933L589.087 635.947L602.391 650.228Z"
                  fill="#3F3D56"
                />
                <path
                  id="Path 2998_3"
                  d="M563.958 753.768H568.393L570.503 732.51H563.957L563.958 753.768Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 2999_4"
                  d="M562.827 759.111H577.128V758.886C577.128 757.052 576.541 755.294 575.498 753.997C574.454 752.7 573.039 751.971 571.563 751.971H562.827L562.827 759.111Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3000_3"
                  d="M602.13 753.588L606.445 752.308L604.524 731.022L598.157 732.911L602.13 753.588Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3001_4"
                  d="M602.029 759.111L615.939 754.983L615.898 754.765C615.555 752.981 614.655 751.439 613.398 750.478C612.14 749.518 610.626 749.217 609.19 749.643L600.694 752.164L602.029 759.111Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3002_3"
                  d="M584.893 598.709V589.431C584.893 586.134 583.839 582.972 581.962 580.641C580.086 578.31 577.541 577 574.888 577C572.235 577 569.69 578.31 567.814 580.641C565.938 582.972 564.884 586.134 564.884 589.431V598.709C564.884 599.151 565.026 599.575 565.278 599.888C565.53 600.201 565.871 600.377 566.227 600.378H583.549C583.905 600.377 584.246 600.201 584.498 599.888C584.75 599.575 584.892 599.151 584.893 598.709Z"
                  fill="#2F2E41"
                />
                <path
                  id="Ellipse 572_3"
                  d="M577.357 600.238C573.306 600.238 570.022 596.157 570.022 591.124C570.022 586.09 573.306 582.009 577.357 582.009C581.408 582.009 584.692 586.09 584.692 591.124C584.692 596.157 581.408 600.238 577.357 600.238Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3003_3"
                  d="M587.259 590.173C587.257 587.566 586.422 585.067 584.939 583.223C583.455 581.38 581.444 580.343 579.345 580.34H577.852C575.754 580.343 573.742 581.38 572.259 583.223C570.775 585.067 569.941 587.566 569.938 590.173V590.359H573.094L574.17 586.614L574.385 590.359H576.017L576.56 588.47L576.669 590.359H587.259V590.173Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3004_3"
                  d="M573.08 639.227L591.755 638.344L592.799 623.163C593.604 620.384 593.617 617.996 592.838 616.071C592.167 614.489 591.041 613.279 589.684 612.684L585.598 606.551C585.072 605.763 584.412 605.13 583.665 604.697C582.918 604.265 582.104 604.044 581.28 604.05L570.661 604.14C570.406 603.949 568.853 602.969 565.791 604.617C562.471 606.405 563.242 612.619 563.25 612.681L563.258 612.739L563.294 612.779L570.357 620.171L573.08 639.227Z"
                  fill="#3F3D56"
                />
                <path
                  id="Path 3005_4"
                  d="M591.605 636.712L600.439 656.725L607.137 747.773L599.57 750.645L586.175 679.421L570.631 748.624L561.559 748.905L567.735 669.044L573.133 638.126L591.605 636.712Z"
                  fill="#2F2E41"
                />
                <path
                  id="Path 3006_2"
                  d="M588.996 642.72C589.183 642.527 589.383 642.853 589.443 643.448L591.281 661.491C591.341 662.087 591.239 662.723 591.052 662.918L568.201 686.497C568.014 686.689 567.813 686.364 567.753 685.769L565.916 667.726C565.855 667.13 565.958 666.494 566.144 666.3L588.996 642.72Z"
                  fill="#536DFE"
                />
                <path
                  id="Path 3011_3"
                  d="M568.005 669.112C567.678 668.747 567.42 668.298 567.248 667.795C567.076 667.293 566.994 666.75 567.009 666.204C567.024 665.659 567.136 665.124 567.335 664.638C567.534 664.151 567.817 663.725 568.163 663.389L564.714 650.829L570.088 652.563L572.536 664.224C572.952 664.984 573.129 665.908 573.034 666.82C572.938 667.731 572.577 668.568 572.018 669.171C571.459 669.773 570.742 670.1 570.002 670.089C569.262 670.079 568.551 669.731 568.004 669.112L568.005 669.112Z"
                  fill="#FFB7B7"
                />
                <path
                  id="Path 3012_3"
                  d="M566.464 661.489L571.677 658.603L569.926 636.692L571.557 614.598L564.596 609.93L563.122 612.241V612.293L562.34 640.232L562.344 640.253L566.464 661.489Z"
                  fill="#3F3D56"
                />
              </g>
              <ellipse
                id="Ellipse 598_2"
                rx="50"
                ry="10.4"
                transform="matrix(-1 0 0 1 593.939 759.4)"
                fill="url(#paint6_radial_92_39)"
                fillOpacity="0.57"
              />
              <g
                id="text_bubble"
                ref={this.textBubble}
                className={styles.text_bubble}
              >
                <path
                  id="text_bubble_background"
                  d="M610.195 549.012L609.682 548.953L609.338 549.338L599.612 560.184L593.885 547.347L593.662 546.847L593.121 546.766C566.6 542.785 544.455 537.037 528.968 530.156C521.222 526.714 515.194 523.012 511.118 519.148C507.043 515.284 505 511.341 505 507.388C505 501.527 509.51 495.686 518.322 490.179C527.082 484.705 539.824 479.739 555.658 475.553C587.313 467.187 631.098 462 679.5 462C727.902 462 771.687 467.187 803.342 475.553C819.176 479.739 831.918 484.705 840.678 490.179C849.491 495.686 854 501.527 854 507.388C854 513.248 849.491 519.089 840.678 524.596C831.918 530.07 819.176 535.036 803.342 539.222C771.687 547.589 727.902 552.775 679.5 552.775C654.878 552.775 631.446 551.433 610.195 549.012Z"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  id="The doors don&#226;&#128;&#153;t seem to open... That&#226;&#128;&#153;s odd!"
                  d="M560.475 491.324H555.904V504H554.039V491.324H549.479V489.781H560.475V491.324ZM564.107 494.713C564.908 493.73 565.95 493.238 567.232 493.238C569.465 493.238 570.592 494.498 570.611 497.018V504H568.805V497.008C568.798 496.246 568.622 495.683 568.277 495.318C567.939 494.954 567.408 494.771 566.686 494.771C566.1 494.771 565.585 494.928 565.143 495.24C564.7 495.553 564.355 495.963 564.107 496.471V504H562.301V489H564.107V494.713ZM577.701 504.195C576.269 504.195 575.104 503.727 574.205 502.789C573.307 501.845 572.857 500.585 572.857 499.01V498.678C572.857 497.63 573.056 496.695 573.453 495.875C573.857 495.048 574.417 494.404 575.133 493.941C575.855 493.473 576.637 493.238 577.477 493.238C578.85 493.238 579.918 493.691 580.68 494.596C581.441 495.501 581.822 496.796 581.822 498.482V499.234H574.664C574.69 500.276 574.993 501.119 575.572 501.764C576.158 502.402 576.9 502.721 577.799 502.721C578.437 502.721 578.977 502.59 579.42 502.33C579.863 502.07 580.25 501.725 580.582 501.295L581.686 502.154C580.8 503.515 579.472 504.195 577.701 504.195ZM577.477 494.723C576.747 494.723 576.135 494.99 575.641 495.523C575.146 496.051 574.84 496.793 574.723 497.75H580.016V497.613C579.964 496.695 579.716 495.986 579.273 495.484C578.831 494.977 578.232 494.723 577.477 494.723ZM588.443 498.629C588.443 497.008 588.827 495.706 589.596 494.723C590.364 493.733 591.37 493.238 592.613 493.238C593.85 493.238 594.83 493.661 595.553 494.508V489H597.359V504H595.699L595.611 502.867C594.889 503.753 593.883 504.195 592.594 504.195C591.37 504.195 590.37 503.694 589.596 502.691C588.827 501.689 588.443 500.38 588.443 498.766V498.629ZM590.25 498.834C590.25 500.032 590.497 500.969 590.992 501.646C591.487 502.324 592.171 502.662 593.043 502.662C594.189 502.662 595.025 502.148 595.553 501.119V496.266C595.012 495.27 594.182 494.771 593.062 494.771C592.177 494.771 591.487 495.113 590.992 495.797C590.497 496.48 590.25 497.493 590.25 498.834ZM599.693 498.619C599.693 497.584 599.895 496.653 600.299 495.826C600.709 494.999 601.275 494.361 601.998 493.912C602.727 493.463 603.557 493.238 604.488 493.238C605.927 493.238 607.089 493.736 607.975 494.732C608.867 495.729 609.312 497.053 609.312 498.707V498.834C609.312 499.863 609.114 500.787 608.717 501.607C608.326 502.421 607.763 503.056 607.027 503.512C606.298 503.967 605.458 504.195 604.508 504.195C603.076 504.195 601.913 503.697 601.021 502.701C600.136 501.705 599.693 500.387 599.693 498.746V498.619ZM601.51 498.834C601.51 500.006 601.78 500.947 602.32 501.656C602.867 502.366 603.596 502.721 604.508 502.721C605.426 502.721 606.155 502.363 606.695 501.646C607.236 500.924 607.506 499.915 607.506 498.619C607.506 497.46 607.229 496.523 606.676 495.807C606.129 495.084 605.4 494.723 604.488 494.723C603.596 494.723 602.877 495.077 602.33 495.787C601.783 496.497 601.51 497.512 601.51 498.834ZM611.1 498.619C611.1 497.584 611.301 496.653 611.705 495.826C612.115 494.999 612.682 494.361 613.404 493.912C614.133 493.463 614.964 493.238 615.895 493.238C617.333 493.238 618.495 493.736 619.381 494.732C620.273 495.729 620.719 497.053 620.719 498.707V498.834C620.719 499.863 620.52 500.787 620.123 501.607C619.732 502.421 619.169 503.056 618.434 503.512C617.704 503.967 616.865 504.195 615.914 504.195C614.482 504.195 613.32 503.697 612.428 502.701C611.542 501.705 611.1 500.387 611.1 498.746V498.619ZM612.916 498.834C612.916 500.006 613.186 500.947 613.727 501.656C614.273 502.366 615.003 502.721 615.914 502.721C616.832 502.721 617.561 502.363 618.102 501.646C618.642 500.924 618.912 499.915 618.912 498.619C618.912 497.46 618.635 496.523 618.082 495.807C617.535 495.084 616.806 494.723 615.895 494.723C615.003 494.723 614.283 495.077 613.736 495.787C613.189 496.497 612.916 497.512 612.916 498.834ZM628.092 495.055C627.818 495.009 627.522 494.986 627.203 494.986C626.018 494.986 625.214 495.491 624.791 496.5V504H622.984V493.434H624.742L624.771 494.654C625.364 493.71 626.204 493.238 627.291 493.238C627.643 493.238 627.91 493.284 628.092 493.375V495.055ZM635.914 501.197C635.914 500.709 635.729 500.331 635.357 500.064C634.993 499.791 634.352 499.557 633.434 499.361C632.522 499.166 631.796 498.932 631.256 498.658C630.722 498.385 630.325 498.059 630.064 497.682C629.811 497.304 629.684 496.855 629.684 496.334C629.684 495.468 630.048 494.736 630.777 494.137C631.513 493.538 632.451 493.238 633.59 493.238C634.788 493.238 635.758 493.548 636.5 494.166C637.249 494.785 637.623 495.576 637.623 496.539H635.807C635.807 496.044 635.595 495.618 635.172 495.26C634.755 494.902 634.228 494.723 633.59 494.723C632.932 494.723 632.418 494.866 632.047 495.152C631.676 495.439 631.49 495.813 631.49 496.275C631.49 496.712 631.663 497.04 632.008 497.262C632.353 497.483 632.975 497.695 633.873 497.896C634.778 498.098 635.51 498.339 636.07 498.619C636.63 498.899 637.044 499.238 637.311 499.635C637.584 500.025 637.721 500.504 637.721 501.07C637.721 502.014 637.343 502.773 636.588 503.346C635.833 503.912 634.853 504.195 633.648 504.195C632.802 504.195 632.053 504.046 631.402 503.746C630.751 503.447 630.24 503.03 629.869 502.496C629.505 501.956 629.322 501.373 629.322 500.748H631.129C631.161 501.354 631.402 501.835 631.852 502.193C632.307 502.545 632.906 502.721 633.648 502.721C634.332 502.721 634.879 502.584 635.289 502.311C635.706 502.031 635.914 501.66 635.914 501.197ZM644.596 498.629C644.596 497.008 644.98 495.706 645.748 494.723C646.516 493.733 647.522 493.238 648.766 493.238C650.003 493.238 650.982 493.661 651.705 494.508V489H653.512V504H651.852L651.764 502.867C651.041 503.753 650.035 504.195 648.746 504.195C647.522 504.195 646.523 503.694 645.748 502.691C644.98 501.689 644.596 500.38 644.596 498.766V498.629ZM646.402 498.834C646.402 500.032 646.65 500.969 647.145 501.646C647.639 502.324 648.323 502.662 649.195 502.662C650.341 502.662 651.178 502.148 651.705 501.119V496.266C651.165 495.27 650.335 494.771 649.215 494.771C648.329 494.771 647.639 495.113 647.145 495.797C646.65 496.48 646.402 497.493 646.402 498.834ZM655.846 498.619C655.846 497.584 656.048 496.653 656.451 495.826C656.861 494.999 657.428 494.361 658.15 493.912C658.88 493.463 659.71 493.238 660.641 493.238C662.079 493.238 663.242 493.736 664.127 494.732C665.019 495.729 665.465 497.053 665.465 498.707V498.834C665.465 499.863 665.266 500.787 664.869 501.607C664.479 502.421 663.915 503.056 663.18 503.512C662.451 503.967 661.611 504.195 660.66 504.195C659.228 504.195 658.066 503.697 657.174 502.701C656.288 501.705 655.846 500.387 655.846 498.746V498.619ZM657.662 498.834C657.662 500.006 657.932 500.947 658.473 501.656C659.02 502.366 659.749 502.721 660.66 502.721C661.578 502.721 662.307 502.363 662.848 501.646C663.388 500.924 663.658 499.915 663.658 498.619C663.658 497.46 663.382 496.523 662.828 495.807C662.281 495.084 661.552 494.723 660.641 494.723C659.749 494.723 659.029 495.077 658.482 495.787C657.936 496.497 657.662 497.512 657.662 498.834ZM669.439 493.434L669.498 494.762C670.305 493.746 671.36 493.238 672.662 493.238C674.895 493.238 676.021 494.498 676.041 497.018V504H674.234V497.008C674.228 496.246 674.052 495.683 673.707 495.318C673.368 494.954 672.838 494.771 672.115 494.771C671.529 494.771 671.015 494.928 670.572 495.24C670.13 495.553 669.785 495.963 669.537 496.471V504H667.73V493.434H669.439ZM678.111 493.785L677.086 493.082C677.691 492.236 678.004 491.344 678.023 490.406V489H679.811V490.27C679.804 490.921 679.641 491.572 679.322 492.223C679.01 492.867 678.606 493.388 678.111 493.785ZM684.439 490.875V493.434H686.412V494.83H684.439V501.383C684.439 501.806 684.527 502.125 684.703 502.34C684.879 502.548 685.178 502.652 685.602 502.652C685.81 502.652 686.096 502.613 686.461 502.535V504C685.986 504.13 685.523 504.195 685.074 504.195C684.267 504.195 683.658 503.951 683.248 503.463C682.838 502.975 682.633 502.281 682.633 501.383V494.83H680.709V493.434H682.633V490.875H684.439ZM699.645 501.197C699.645 500.709 699.459 500.331 699.088 500.064C698.723 499.791 698.082 499.557 697.164 499.361C696.253 499.166 695.527 498.932 694.986 498.658C694.452 498.385 694.055 498.059 693.795 497.682C693.541 497.304 693.414 496.855 693.414 496.334C693.414 495.468 693.779 494.736 694.508 494.137C695.243 493.538 696.181 493.238 697.32 493.238C698.518 493.238 699.488 493.548 700.23 494.166C700.979 494.785 701.354 495.576 701.354 496.539H699.537C699.537 496.044 699.326 495.618 698.902 495.26C698.486 494.902 697.958 494.723 697.32 494.723C696.663 494.723 696.148 494.866 695.777 495.152C695.406 495.439 695.221 495.813 695.221 496.275C695.221 496.712 695.393 497.04 695.738 497.262C696.083 497.483 696.705 497.695 697.604 497.896C698.508 498.098 699.241 498.339 699.801 498.619C700.361 498.899 700.774 499.238 701.041 499.635C701.314 500.025 701.451 500.504 701.451 501.07C701.451 502.014 701.074 502.773 700.318 503.346C699.563 503.912 698.583 504.195 697.379 504.195C696.533 504.195 695.784 504.046 695.133 503.746C694.482 503.447 693.971 503.03 693.6 502.496C693.235 501.956 693.053 501.373 693.053 500.748H694.859C694.892 501.354 695.133 501.835 695.582 502.193C696.038 502.545 696.637 502.721 697.379 502.721C698.062 502.721 698.609 502.584 699.02 502.311C699.436 502.031 699.645 501.66 699.645 501.197ZM708.189 504.195C706.757 504.195 705.592 503.727 704.693 502.789C703.795 501.845 703.346 500.585 703.346 499.01V498.678C703.346 497.63 703.544 496.695 703.941 495.875C704.345 495.048 704.905 494.404 705.621 493.941C706.344 493.473 707.125 493.238 707.965 493.238C709.339 493.238 710.406 493.691 711.168 494.596C711.93 495.501 712.311 496.796 712.311 498.482V499.234H705.152C705.178 500.276 705.481 501.119 706.061 501.764C706.646 502.402 707.389 502.721 708.287 502.721C708.925 502.721 709.465 502.59 709.908 502.33C710.351 502.07 710.738 501.725 711.07 501.295L712.174 502.154C711.288 503.515 709.96 504.195 708.189 504.195ZM707.965 494.723C707.236 494.723 706.624 494.99 706.129 495.523C705.634 496.051 705.328 496.793 705.211 497.75H710.504V497.613C710.452 496.695 710.204 495.986 709.762 495.484C709.319 494.977 708.72 494.723 707.965 494.723ZM718.795 504.195C717.363 504.195 716.197 503.727 715.299 502.789C714.4 501.845 713.951 500.585 713.951 499.01V498.678C713.951 497.63 714.15 496.695 714.547 495.875C714.951 495.048 715.51 494.404 716.227 493.941C716.949 493.473 717.73 493.238 718.57 493.238C719.944 493.238 721.012 493.691 721.773 494.596C722.535 495.501 722.916 496.796 722.916 498.482V499.234H715.758C715.784 500.276 716.087 501.119 716.666 501.764C717.252 502.402 717.994 502.721 718.893 502.721C719.531 502.721 720.071 502.59 720.514 502.33C720.956 502.07 721.344 501.725 721.676 501.295L722.779 502.154C721.894 503.515 720.566 504.195 718.795 504.195ZM718.57 494.723C717.841 494.723 717.229 494.99 716.734 495.523C716.24 496.051 715.934 496.793 715.816 497.75H721.109V497.613C721.057 496.695 720.81 495.986 720.367 495.484C719.924 494.977 719.326 494.723 718.57 494.723ZM726.715 493.434L726.764 494.605C727.538 493.694 728.583 493.238 729.898 493.238C731.376 493.238 732.382 493.805 732.916 494.938C733.268 494.43 733.723 494.02 734.283 493.707C734.85 493.395 735.517 493.238 736.285 493.238C738.603 493.238 739.781 494.465 739.82 496.92V504H738.014V497.027C738.014 496.272 737.841 495.709 737.496 495.338C737.151 494.96 736.572 494.771 735.758 494.771C735.087 494.771 734.531 494.973 734.088 495.377C733.645 495.774 733.388 496.311 733.316 496.988V504H731.5V497.076C731.5 495.54 730.748 494.771 729.244 494.771C728.059 494.771 727.249 495.276 726.812 496.285V504H725.006V493.434H726.715ZM749.967 490.875V493.434H751.939V494.83H749.967V501.383C749.967 501.806 750.055 502.125 750.23 502.34C750.406 502.548 750.706 502.652 751.129 502.652C751.337 502.652 751.624 502.613 751.988 502.535V504C751.513 504.13 751.051 504.195 750.602 504.195C749.794 504.195 749.186 503.951 748.775 503.463C748.365 502.975 748.16 502.281 748.16 501.383V494.83H746.236V493.434H748.16V490.875H749.967ZM753.385 498.619C753.385 497.584 753.587 496.653 753.99 495.826C754.4 494.999 754.967 494.361 755.689 493.912C756.419 493.463 757.249 493.238 758.18 493.238C759.618 493.238 760.781 493.736 761.666 494.732C762.558 495.729 763.004 497.053 763.004 498.707V498.834C763.004 499.863 762.805 500.787 762.408 501.607C762.018 502.421 761.454 503.056 760.719 503.512C759.99 503.967 759.15 504.195 758.199 504.195C756.767 504.195 755.605 503.697 754.713 502.701C753.827 501.705 753.385 500.387 753.385 498.746V498.619ZM755.201 498.834C755.201 500.006 755.471 500.947 756.012 501.656C756.559 502.366 757.288 502.721 758.199 502.721C759.117 502.721 759.846 502.363 760.387 501.646C760.927 500.924 761.197 499.915 761.197 498.619C761.197 497.46 760.921 496.523 760.367 495.807C759.82 495.084 759.091 494.723 758.18 494.723C757.288 494.723 756.568 495.077 756.021 495.787C755.475 496.497 755.201 497.512 755.201 498.834ZM769.752 498.619C769.752 497.584 769.954 496.653 770.357 495.826C770.768 494.999 771.334 494.361 772.057 493.912C772.786 493.463 773.616 493.238 774.547 493.238C775.986 493.238 777.148 493.736 778.033 494.732C778.925 495.729 779.371 497.053 779.371 498.707V498.834C779.371 499.863 779.173 500.787 778.775 501.607C778.385 502.421 777.822 503.056 777.086 503.512C776.357 503.967 775.517 504.195 774.566 504.195C773.134 504.195 771.972 503.697 771.08 502.701C770.195 501.705 769.752 500.387 769.752 498.746V498.619ZM771.568 498.834C771.568 500.006 771.839 500.947 772.379 501.656C772.926 502.366 773.655 502.721 774.566 502.721C775.484 502.721 776.214 502.363 776.754 501.646C777.294 500.924 777.564 499.915 777.564 498.619C777.564 497.46 777.288 496.523 776.734 495.807C776.188 495.084 775.458 494.723 774.547 494.723C773.655 494.723 772.936 495.077 772.389 495.787C771.842 496.497 771.568 497.512 771.568 498.834ZM790.562 498.834C790.562 500.442 790.195 501.738 789.459 502.721C788.723 503.704 787.727 504.195 786.471 504.195C785.188 504.195 784.179 503.788 783.443 502.975V508.062H781.637V493.434H783.287L783.375 494.605C784.111 493.694 785.133 493.238 786.441 493.238C787.711 493.238 788.714 493.717 789.449 494.674C790.191 495.631 790.562 496.962 790.562 498.668V498.834ZM788.756 498.629C788.756 497.438 788.502 496.497 787.994 495.807C787.486 495.117 786.79 494.771 785.904 494.771C784.811 494.771 783.99 495.257 783.443 496.227V501.275C783.984 502.239 784.811 502.721 785.924 502.721C786.79 502.721 787.477 502.379 787.984 501.695C788.499 501.005 788.756 499.983 788.756 498.629ZM797.252 504.195C795.82 504.195 794.654 503.727 793.756 502.789C792.857 501.845 792.408 500.585 792.408 499.01V498.678C792.408 497.63 792.607 496.695 793.004 495.875C793.408 495.048 793.967 494.404 794.684 493.941C795.406 493.473 796.188 493.238 797.027 493.238C798.401 493.238 799.469 493.691 800.23 494.596C800.992 495.501 801.373 496.796 801.373 498.482V499.234H794.215C794.241 500.276 794.544 501.119 795.123 501.764C795.709 502.402 796.451 502.721 797.35 502.721C797.988 502.721 798.528 502.59 798.971 502.33C799.413 502.07 799.801 501.725 800.133 501.295L801.236 502.154C800.351 503.515 799.023 504.195 797.252 504.195ZM797.027 494.723C796.298 494.723 795.686 494.99 795.191 495.523C794.697 496.051 794.391 496.793 794.273 497.75H799.566V497.613C799.514 496.695 799.267 495.986 798.824 495.484C798.382 494.977 797.783 494.723 797.027 494.723ZM805.182 493.434L805.24 494.762C806.048 493.746 807.102 493.238 808.404 493.238C810.637 493.238 811.764 494.498 811.783 497.018V504H809.977V497.008C809.97 496.246 809.794 495.683 809.449 495.318C809.111 494.954 808.58 494.771 807.857 494.771C807.271 494.771 806.757 494.928 806.314 495.24C805.872 495.553 805.527 495.963 805.279 496.471V504H803.473V493.434H805.182ZM814.547 503.053C814.547 502.74 814.638 502.48 814.82 502.271C815.009 502.063 815.289 501.959 815.66 501.959C816.031 501.959 816.311 502.063 816.5 502.271C816.695 502.48 816.793 502.74 816.793 503.053C816.793 503.352 816.695 503.603 816.5 503.805C816.311 504.007 816.031 504.107 815.66 504.107C815.289 504.107 815.009 504.007 814.82 503.805C814.638 503.603 814.547 503.352 814.547 503.053ZM819.82 503.053C819.82 502.74 819.911 502.48 820.094 502.271C820.283 502.063 820.562 501.959 820.934 501.959C821.305 501.959 821.585 502.063 821.773 502.271C821.969 502.48 822.066 502.74 822.066 503.053C822.066 503.352 821.969 503.603 821.773 503.805C821.585 504.007 821.305 504.107 820.934 504.107C820.562 504.107 820.283 504.007 820.094 503.805C819.911 503.603 819.82 503.352 819.82 503.053ZM825.094 503.053C825.094 502.74 825.185 502.48 825.367 502.271C825.556 502.063 825.836 501.959 826.207 501.959C826.578 501.959 826.858 502.063 827.047 502.271C827.242 502.48 827.34 502.74 827.34 503.053C827.34 503.352 827.242 503.603 827.047 503.805C826.858 504.007 826.578 504.107 826.207 504.107C825.836 504.107 825.556 504.007 825.367 503.805C825.185 503.603 825.094 503.352 825.094 503.053ZM560.475 514.324H555.904V527H554.039V514.324H549.479V512.781H560.475V514.324ZM564.107 517.713C564.908 516.73 565.95 516.238 567.232 516.238C569.465 516.238 570.592 517.498 570.611 520.018V527H568.805V520.008C568.798 519.246 568.622 518.683 568.277 518.318C567.939 517.954 567.408 517.771 566.686 517.771C566.1 517.771 565.585 517.928 565.143 518.24C564.7 518.553 564.355 518.963 564.107 519.471V527H562.301V512H564.107V517.713ZM579.84 527C579.736 526.792 579.651 526.421 579.586 525.887C578.746 526.759 577.743 527.195 576.578 527.195C575.536 527.195 574.68 526.902 574.01 526.316C573.346 525.724 573.014 524.975 573.014 524.07C573.014 522.97 573.43 522.117 574.264 521.512C575.104 520.9 576.282 520.594 577.799 520.594H579.557V519.764C579.557 519.132 579.368 518.631 578.99 518.26C578.613 517.882 578.056 517.693 577.32 517.693C576.676 517.693 576.135 517.856 575.699 518.182C575.263 518.507 575.045 518.901 575.045 519.363H573.229C573.229 518.836 573.414 518.328 573.785 517.84C574.163 517.345 574.671 516.954 575.309 516.668C575.953 516.382 576.66 516.238 577.428 516.238C578.645 516.238 579.599 516.544 580.289 517.156C580.979 517.762 581.337 518.598 581.363 519.666V524.529C581.363 525.499 581.487 526.271 581.734 526.844V527H579.84ZM576.842 525.623C577.408 525.623 577.945 525.477 578.453 525.184C578.961 524.891 579.329 524.51 579.557 524.041V521.873H578.141C575.927 521.873 574.82 522.521 574.82 523.816C574.82 524.383 575.009 524.826 575.387 525.145C575.764 525.464 576.249 525.623 576.842 525.623ZM586.646 513.875V516.434H588.619V517.83H586.646V524.383C586.646 524.806 586.734 525.125 586.91 525.34C587.086 525.548 587.385 525.652 587.809 525.652C588.017 525.652 588.303 525.613 588.668 525.535V527C588.193 527.13 587.73 527.195 587.281 527.195C586.474 527.195 585.865 526.951 585.455 526.463C585.045 525.975 584.84 525.281 584.84 524.383V517.83H582.916V516.434H584.84V513.875H586.646ZM590.865 516.785L589.84 516.082C590.445 515.236 590.758 514.344 590.777 513.406V512H592.564V513.27C592.558 513.921 592.395 514.572 592.076 515.223C591.764 515.867 591.36 516.388 590.865 516.785ZM599.801 524.197C599.801 523.709 599.615 523.331 599.244 523.064C598.88 522.791 598.238 522.557 597.32 522.361C596.409 522.166 595.683 521.932 595.143 521.658C594.609 521.385 594.212 521.059 593.951 520.682C593.697 520.304 593.57 519.855 593.57 519.334C593.57 518.468 593.935 517.736 594.664 517.137C595.4 516.538 596.337 516.238 597.477 516.238C598.674 516.238 599.645 516.548 600.387 517.166C601.135 517.785 601.51 518.576 601.51 519.539H599.693C599.693 519.044 599.482 518.618 599.059 518.26C598.642 517.902 598.115 517.723 597.477 517.723C596.819 517.723 596.305 517.866 595.934 518.152C595.562 518.439 595.377 518.813 595.377 519.275C595.377 519.712 595.549 520.04 595.895 520.262C596.24 520.483 596.861 520.695 597.76 520.896C598.665 521.098 599.397 521.339 599.957 521.619C600.517 521.899 600.93 522.238 601.197 522.635C601.471 523.025 601.607 523.504 601.607 524.07C601.607 525.014 601.23 525.773 600.475 526.346C599.719 526.912 598.74 527.195 597.535 527.195C596.689 527.195 595.94 527.046 595.289 526.746C594.638 526.447 594.127 526.03 593.756 525.496C593.391 524.956 593.209 524.373 593.209 523.748H595.016C595.048 524.354 595.289 524.835 595.738 525.193C596.194 525.545 596.793 525.721 597.535 525.721C598.219 525.721 598.766 525.584 599.176 525.311C599.592 525.031 599.801 524.66 599.801 524.197ZM608.443 521.619C608.443 520.584 608.645 519.653 609.049 518.826C609.459 517.999 610.025 517.361 610.748 516.912C611.477 516.463 612.307 516.238 613.238 516.238C614.677 516.238 615.839 516.736 616.725 517.732C617.617 518.729 618.062 520.053 618.062 521.707V521.834C618.062 522.863 617.864 523.787 617.467 524.607C617.076 525.421 616.513 526.056 615.777 526.512C615.048 526.967 614.208 527.195 613.258 527.195C611.826 527.195 610.663 526.697 609.771 525.701C608.886 524.705 608.443 523.387 608.443 521.746V521.619ZM610.26 521.834C610.26 523.006 610.53 523.947 611.07 524.656C611.617 525.366 612.346 525.721 613.258 525.721C614.176 525.721 614.905 525.363 615.445 524.646C615.986 523.924 616.256 522.915 616.256 521.619C616.256 520.46 615.979 519.523 615.426 518.807C614.879 518.084 614.15 517.723 613.238 517.723C612.346 517.723 611.627 518.077 611.08 518.787C610.533 519.497 610.26 520.512 610.26 521.834ZM619.889 521.629C619.889 520.008 620.273 518.706 621.041 517.723C621.809 516.733 622.815 516.238 624.059 516.238C625.296 516.238 626.275 516.661 626.998 517.508V512H628.805V527H627.145L627.057 525.867C626.334 526.753 625.328 527.195 624.039 527.195C622.815 527.195 621.816 526.694 621.041 525.691C620.273 524.689 619.889 523.38 619.889 521.766V521.629ZM621.695 521.834C621.695 523.032 621.943 523.969 622.438 524.646C622.932 525.324 623.616 525.662 624.488 525.662C625.634 525.662 626.471 525.148 626.998 524.119V519.266C626.458 518.27 625.628 517.771 624.508 517.771C623.622 517.771 622.932 518.113 622.438 518.797C621.943 519.48 621.695 520.493 621.695 521.834ZM631.178 521.629C631.178 520.008 631.562 518.706 632.33 517.723C633.098 516.733 634.104 516.238 635.348 516.238C636.585 516.238 637.564 516.661 638.287 517.508V512H640.094V527H638.434L638.346 525.867C637.623 526.753 636.617 527.195 635.328 527.195C634.104 527.195 633.105 526.694 632.33 525.691C631.562 524.689 631.178 523.38 631.178 521.766V521.629ZM632.984 521.834C632.984 523.032 633.232 523.969 633.727 524.646C634.221 525.324 634.905 525.662 635.777 525.662C636.923 525.662 637.76 525.148 638.287 524.119V519.266C637.747 518.27 636.917 517.771 635.797 517.771C634.911 517.771 634.221 518.113 633.727 518.797C633.232 519.48 632.984 520.493 632.984 521.834ZM644.928 522.986H643.297L643.17 512.781H645.064L644.928 522.986ZM643.102 526.092C643.102 525.799 643.189 525.555 643.365 525.359C643.548 525.158 643.814 525.057 644.166 525.057C644.518 525.057 644.785 525.158 644.967 525.359C645.149 525.555 645.24 525.799 645.24 526.092C645.24 526.385 645.149 526.629 644.967 526.824C644.785 527.013 644.518 527.107 644.166 527.107C643.814 527.107 643.548 527.013 643.365 526.824C643.189 526.629 643.102 526.385 643.102 526.092Z"
                  fill="black"
                />
              </g>
              <g
                id="submit_flag_2"
                onClick={() => this.openFlagSubmitModal(2)}
                ref={this.flagTwoButton}
                className={styles.flag_button}
              >
                <rect
                  id="Rectangle 27_2"
                  x="706"
                  y="523"
                  width="135"
                  height="47.581"
                  rx="9"
                  fill={`${this.getFillColor(2)}`}
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  id="Vector_145"
                  d="M741.656 550.216H739.617C739.347 550.216 739.087 550.323 738.896 550.514C738.705 550.705 738.598 550.965 738.598 551.235V558.37H718.211V537.983H727.385C727.655 537.983 727.914 537.876 728.106 537.685C728.297 537.494 728.404 537.234 728.404 536.964V534.925C728.404 534.655 728.297 534.396 728.106 534.205C727.914 534.013 727.655 533.906 727.385 533.906H717.191C716.38 533.906 715.602 534.228 715.029 534.802C714.455 535.375 714.133 536.153 714.133 536.964V559.39C714.133 560.201 714.455 560.978 715.029 561.552C715.602 562.125 716.38 562.448 717.191 562.448H739.617C740.428 562.448 741.206 562.125 741.779 561.552C742.353 560.978 742.675 560.201 742.675 559.39V551.235C742.675 550.965 742.568 550.705 742.376 550.514C742.185 550.323 741.926 550.216 741.656 550.216ZM745.223 529.829H737.069C735.707 529.829 735.027 531.479 735.986 532.441L738.262 534.717L722.734 550.239C722.591 550.381 722.478 550.55 722.401 550.736C722.324 550.922 722.284 551.121 722.284 551.322C722.284 551.523 722.324 551.723 722.401 551.909C722.478 552.094 722.591 552.263 722.734 552.405L724.178 553.847C724.32 553.989 724.489 554.103 724.675 554.18C724.861 554.257 725.06 554.297 725.261 554.297C725.463 554.297 725.662 554.257 725.848 554.18C726.034 554.103 726.202 553.989 726.344 553.847L741.865 538.322L744.14 540.595C745.096 541.551 746.752 540.882 746.752 539.512V531.358C746.752 530.952 746.591 530.563 746.305 530.276C746.018 529.99 745.629 529.829 745.223 529.829V529.829Z"
                  fill="white"
                />
                <path
                  id="Flag 2"
                  d="M772.572 548.884H765.259V556.438H761.45V537.954H773.486V541.039H765.259V545.812H772.572V548.884ZM779.325 556.438H775.644V536.938H779.325V556.438ZM790.32 556.438C790.15 556.108 790.028 555.697 789.951 555.207C789.063 556.197 787.907 556.692 786.486 556.692C785.14 556.692 784.023 556.303 783.134 555.524C782.254 554.745 781.814 553.764 781.814 552.579C781.814 551.123 782.351 550.006 783.426 549.227C784.509 548.448 786.071 548.055 788.111 548.046H789.799V547.259C789.799 546.625 789.634 546.117 789.304 545.736C788.982 545.355 788.47 545.165 787.768 545.165C787.15 545.165 786.663 545.313 786.308 545.609C785.961 545.905 785.787 546.311 785.787 546.828H782.118C782.118 546.032 782.364 545.296 782.855 544.619C783.346 543.942 784.04 543.413 784.937 543.032C785.834 542.642 786.841 542.448 787.958 542.448C789.651 542.448 790.992 542.875 791.983 543.73C792.981 544.576 793.481 545.77 793.481 547.31V553.264C793.489 554.568 793.671 555.554 794.027 556.222V556.438H790.32ZM787.285 553.886C787.827 553.886 788.326 553.768 788.783 553.531C789.24 553.285 789.579 552.959 789.799 552.553V550.192H788.428C786.591 550.192 785.614 550.827 785.495 552.096L785.483 552.312C785.483 552.769 785.643 553.146 785.965 553.442C786.287 553.738 786.727 553.886 787.285 553.886ZM795.766 549.468C795.766 547.361 796.265 545.664 797.264 544.377C798.271 543.091 799.625 542.448 801.326 542.448C802.833 542.448 804.005 542.964 804.843 543.997L804.995 542.702H808.322V555.981C808.322 557.183 808.046 558.228 807.496 559.117C806.955 560.005 806.189 560.682 805.198 561.148C804.208 561.613 803.049 561.846 801.72 561.846C800.713 561.846 799.731 561.643 798.775 561.237C797.818 560.839 797.095 560.323 796.604 559.688L798.229 557.454C799.143 558.478 800.252 558.99 801.555 558.99C802.528 558.99 803.286 558.727 803.827 558.203C804.369 557.686 804.64 556.95 804.64 555.994V555.257C803.794 556.214 802.681 556.692 801.301 556.692C799.651 556.692 798.313 556.049 797.289 554.762C796.274 553.467 795.766 551.753 795.766 549.621V549.468ZM799.435 549.735C799.435 550.979 799.684 551.957 800.184 552.667C800.683 553.37 801.369 553.721 802.24 553.721C803.358 553.721 804.157 553.302 804.64 552.464V546.688C804.149 545.85 803.358 545.431 802.266 545.431C801.386 545.431 800.692 545.791 800.184 546.51C799.684 547.23 799.435 548.305 799.435 549.735ZM830.145 556.438H817.475V553.924L823.454 547.551C824.275 546.654 824.88 545.871 825.27 545.203C825.668 544.534 825.866 543.899 825.866 543.298C825.866 542.477 825.659 541.834 825.244 541.369C824.83 540.895 824.237 540.658 823.467 540.658C822.638 540.658 821.982 540.945 821.499 541.521C821.025 542.088 820.788 542.837 820.788 543.768H817.107C817.107 542.642 817.373 541.614 817.906 540.683C818.448 539.752 819.21 539.024 820.192 538.5C821.173 537.966 822.286 537.7 823.531 537.7C825.435 537.7 826.912 538.157 827.961 539.071C829.019 539.985 829.548 541.276 829.548 542.943C829.548 543.857 829.311 544.788 828.837 545.736C828.363 546.684 827.551 547.788 826.4 549.049L822.198 553.48H830.145V556.438Z"
                  fill="white"
                />
              </g>
            </g>
          </g>
          <defs>
            <radialGradient
              id="paint0_radial_92:39"
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
              id="paint1_linear_92:39"
              x1="1071"
              y1="1136.04"
              x2="1007.92"
              y2="418.862"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.123398" stopColor="#949494" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_92:39"
              x1="1465.75"
              y1="966.632"
              x2="1465.75"
              y2="727.681"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C4C4C4" stopOpacity="0" />
              <stop offset="1" stopColor="#4B4B4B" />
            </linearGradient>
            <radialGradient
              id="paint3_radial_92:39"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(1706.65 965) rotate(90) scale(13 62.5)"
            >
              <stop stopOpacity="0.32" />
              <stop offset="1" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id="paint4_linear_92:39"
              x1="414.007"
              y1="1095.95"
              x2="414.007"
              y2="984.353"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.148958" stopOpacity="0" />
              <stop offset="0.8625" />
            </linearGradient>
            <radialGradient
              id="paint5_radial_92:39"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(843.568 963.918) rotate(90) scale(13 62.5)"
            >
              <stop stopOpacity="0.32" />
              <stop offset="1" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id="paint6_radial_92:39"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(50 10.4) rotate(90) scale(10.4 50)"
            >
              <stop stopOpacity="0.32" />
              <stop offset="1" stopOpacity="0" />
            </radialGradient>
            <clipPath id="clip0_92:39">
              <rect width="1920" height="1080" fill="white" />
            </clipPath>
            <clipPath id="clip1_92:39">
              <rect
                width="554"
                height="753"
                fill="white"
                transform="translate(821.65 6.61108)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  }
}

export default Platform;
