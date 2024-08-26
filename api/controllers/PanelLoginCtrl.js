const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
// const FPO = require("../models/Fposchema");
const constants = require("../constants");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const Consultant = require("../models/ConsultantSchema");
const Doctor = require("../models/DoctorSchema");
// const { pagination } = require("./pagination");

const AdminLogin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ mobileno: req.body.mobileno });

    if (admin.role !== "admin") {
      return res.status(500).send({ message: "Wrong Credentials" });
    }

    if (!admin) {
      return res.status(404).send({ message: "Not a registered admin" });
    }
    if (admin.status === 2) {
      return res
        .status(500)
        .send({ message: "Your Account is blocked, Please contact Superadmin" });
    }
    if (admin.status === 0) {
      return res.status(500).send({
        message: "Your Account is Deactivated, Please contact Superadmin",
      });
    }

    console.log(req.body.password, admin.password);
    const isMatch = admin.password === req.body.password;
    console.log(isMatch);
    if (!isMatch)
      return res.status(500).json({ message: "Password is incorrect." });

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        mobileno: admin.mobileno,
        role: admin.role,
        email: admin.email,
        permissions: admin.permissions,
        image: admin.image,

        // fpo: admin?.fpo,
        // image: admin?.image,
      },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(500).send(e);
  }
};
const superLogin = async (req, res) => {
  try {
    // const { role } = req.query;

    const admin = await Admin.findOne({ mobileno: req.body.mobileno });

    if (admin.role !== "superadmin") {
      return res.status(500).send({ message: "Wrong Credentials" });
    }

    if (!admin) {
      return res.status(404).send({ message: "Not a registered admin" });
    }
    if (admin.status === 2) {
      return res
        .status(500)
        .send({ message: "Your Account is blocked, Please contact Superadmin" });
    }
    if (admin.status === 0) {
      return res.status(500).send({
        message: "Your Account is Deactivated, Please contact Superadmin",
      });
    }

    console.log(req.body.password, admin.password);
    const isMatch = admin.password === req.body.password;
    console.log(isMatch);
    if (!isMatch)
      return res.status(500).json({ message: "Password is incorrect." });

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        mobileno: admin.mobileno,
        role: admin.role,
        email: admin.email,
        permissions: admin.permissions,
        image: admin.image,

        // fpo: admin?.fpo,
        // image: admin?.image,
      },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(500).send(e);
  }
};

const ConsultantLogin = async (req, res) => {
  console.log("consultant");
  try {
    const admin = await Consultant.findOne({ mobileno: req.body.mobileno });
    if (!admin) {
      return res.status(404).send({ message: "Not a registered Consultant" });
    }
    if (admin.status === 2) {
      return res
        .status(500)
        .send({ message: "Your Account is blocked, Please contact Superadmin" });
    }
    if (admin.status === 0) {
      return res.status(500).send({
        message: "Your Account is Deactivated, Please contact Superadmin",
      });
    }

    console.log(req.body.password, admin.password);
    const isMatch = admin.password === req.body.password;
    console.log(isMatch);
    if (!isMatch)
      return res.status(500).json({ message: "Password is incorrect." });

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        mobileno: admin.mobileno,
        role: admin.role,
        email: admin.email,
        permissions: admin.permissions,
        adminId: admin.admin,
        memberid: admin.memberId,
        image: admin.image,
        // fpo: admin?.fpo,
        // image: admin?.image,
      },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(500).send(e);
  }
};
const DoctorLogin = async (req, res) => {
  try {
    const admin = await Doctor.findOne({ mobileno: req.body.mobileno });
    if (!admin) {
      return res.status(404).send({ message: "Not a registered Doctor" });
    }
    if (admin.status === 2) {
      return res
        .status(500)
        .send({ message: "Your Account is blocked, Please contact Superadmin" });
    }
    if (admin.status === 0) {
      return res.status(500).send({
        message: "Your Account is Deactivated, Please contact Superadmin",
      });
    }

    console.log(req.body.password, admin.password);
    const isMatch = admin.password === req.body.password;
    console.log(isMatch);
    if (!isMatch)
      return res.status(500).json({ message: "Password is incorrect." });

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        mobileno: admin.mobileno,
        role: admin.role,
        email: admin.email,
        permissions: admin.permissions,
        adminId: admin.admin,
        memberid: admin.memberId,
        image: admin.image,

        // fpo: admin?.fpo,
        // image: admin?.image,
      },
      process.env.JWT_SECRET_KEY
    );
    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(500).send(e);
  }
};

const forgotpassword = async (req, res) => {
  const { email, role } = req.body;
  try {
    let user;

    if (role === "admin" || role === "superadmin") {
      user = await Admin.findOne({
        email,
        role: { $in: ["admin", "superadmin"] },
      });
    } else {
      user = await Admin.findOne({ email, role });
    }

    console.log(email, user, role);
    if (!user) {
      return res.status(500).send({ message: "We cannot find your email." });
    } else {
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ email: user.email, id: user.id }, secret, {
        expiresIn: "5m",
      });
      const link = `${constants.renderUrl}api/user/resetpassword/${user.id}/${token}`;
      const link2 = `${constants.frontUrl}resetpassword?id=${user.id}&token=${token}`;

      // console.log(link, link2, "================= link ============= ");
      // save the token in the database along with the user id and an expiration date
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      // send the password reset email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: constants.adminEmail,
          pass: constants.adminPass,
        },
      });

      let passbody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html
        xmlns="http://www.w3.org/1999/xhtml"
        xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office"
      >
        <head>
          <!--[if gte mso 9]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG />
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          <![endif]-->
          <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="format-detection" content="date=no" />
          <meta name="format-detection" content="address=no" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="x-apple-disable-message-reformatting" />
          <!--[if !mso]><!-->
          <link
            href="https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i&display=swap"
            rel="stylesheet"
          />
          <!--<![endif]-->
          <title>Email Template</title>
          <!--[if gte mso 9]>
            <style type="text/css" media="all">
              sup {
                font-size: 100% !important;
              }
            </style>
          <![endif]-->
          <!-- body, html, table, thead, tbody, tr, td, div, a, span { font-family: Arial, sans-serif !important; } -->
      
          <style type="text/css" media="screen">
            body {
              padding: 0 !important;
              margin: 0 auto !important;
              display: block !important;
              min-width: 100% !important;
              width: 100% !important;
              background: #f4ecfa;
              -webkit-text-size-adjust: none;
            }
            a {
              color: #f3189e;
              text-decoration: none;
            }
            p {
              padding: 0 !important;
              margin: 0 !important;
            }
            img {
              margin: 0 !important;
              -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */
            }
      
            a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: inherit !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
            }
      
            .btn-16 a {
              display: block;
              padding: 15px 35px;
              text-decoration: none;
            }
            .btn-20 a {
              display: block;
              padding: 15px 35px;
              text-decoration: none;
            }
      
            .l-white a {
              color: #ffffff;
            }
            .l-black a {
              color: #282828;
            }
            .l-pink a {
              color: #f3189e;
            }
            .l-grey a {
              color: #6e6e6e;
            }
            .l-purple a {
              color: #9128df;
            }
      
            .gradient {
              /* background: linear-gradient(90deg, #5170ff, #ff66c4); */
              background: #1a1a70;
            }
      
            .btn-secondary {
              border-radius: 10px;
              background: linear-gradient(90deg, #5170ff, #ff66c4);
            }
      
            /* Mobile styles */
            @media only screen and (max-device-width: 480px),
              only screen and (max-width: 480px) {
              .mpx-10 {
                padding-left: 10px !important;
                padding-right: 10px !important;
              }
      
              .mpx-15 {
                padding-left: 15px !important;
                padding-right: 15px !important;
              }
      
              u + .body .gwfw {
                width: 100% !important;
                width: 100vw !important;
              }
      
              .td,
              .m-shell {
                width: 100% !important;
                min-width: 100% !important;
              }
      
              .mt-left {
                text-align: left !important;
              }
              .mt-center {
                text-align: center !important;
              }
              .mt-right {
                text-align: right !important;
              }
      
              .me-left {
                margin-right: auto !important;
              }
              .me-center {
                margin: 0 auto !important;
              }
              .me-right {
                margin-left: auto !important;
              }
      
              .mh-auto {
                height: auto !important;
              }
              .mw-auto {
                width: auto !important;
              }
      
              .fluid-img img {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
              }
      
              .column,
              .column-top,
              .column-dir-top {
                float: left !important;
                width: 100% !important;
                display: block !important;
              }
      
              .m-hide {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                font-size: 0 !important;
                line-height: 0 !important;
                min-height: 0 !important;
              }
              .m-block {
                display: block !important;
              }
      
              .mw-15 {
                width: 15px !important;
              }
      
              .mw-2p {
                width: 2% !important;
              }
              .mw-32p {
                width: 32% !important;
              }
              .mw-49p {
                width: 49% !important;
              }
              .mw-50p {
                width: 50% !important;
              }
              .mw-100p {
                width: 100% !important;
              }
      
              .mmt-0 {
                margin-top: 0 !important;
              }
            }
          </style>
        </head>
        <body
          class="body"
          style="
            padding: 0 !important;
            margin: 0 auto !important;
            display: block !important;
            min-width: 100% !important;
            width: 100% !important;
            background: #f4ecfa;
            -webkit-text-size-adjust: none;
          "
        >
          <center>
            <table
              width="100%"
              border="0"
              cellspacing="0"
              cellpadding="0"
              style="margin: 0; padding: 0; width: 100%; height: 100%"
              bgcolor="#f4ecfa"
              class="gwfw"
            >
              <tr>
                <td
                  style="margin: 0; padding: 0; width: 100%; height: 100%"
                  align="center"
                  valign="top"
                >
                  <table
                    width="600"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    class="m-shell"
                  >
                    <tr>
                      <td
                        class="td"
                        style="
                          width: 600px;
                          min-width: 600px;
                          font-size: 0pt;
                          line-height: 0pt;
                          padding: 0;
                          margin: 0;
                          font-weight: normal;
                        "
                      >
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tr>
                            <td class="mpx-10">
                              <!-- Top -->
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    class="text-12 c-grey l-grey a-right py-20"
                                    style="
                                      font-size: 12px;
                                      line-height: 16px;
                                      font-family: 'PT Sans', Arial, sans-serif;
                                      min-width: auto !important;
                                      color: #6e6e6e;
                                      text-align: right;
                                      padding-top: 20px;
                                      padding-bottom: 20px;
                                    "
                                  >
                                    <a
                                      href="#"
                                      target="_blank"
                                      class="link c-grey"
                                      style="text-decoration: none; color: #6e6e6e"
                                      ><span
                                        class="link c-grey"
                                        style="text-decoration: none; color: #6e6e6e"
                                      ></span
                                    ></a>
                                  </td>
                                </tr>
                              </table>
                              <!-- END Top -->
      
                              <!-- Container -->
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    class="gradient pt-10"
                                    style="
                                      border-radius: 10px 10px 0 0;
                                      padding-top: 10px;
                                    "
                                    bgcolor="rgb(189, 50, 40)"
                                  >
                                    <table
                                      width="100%"
                                      border="0"
                                      cellspacing="0"
                                      cellpadding="0"
                                    >
                                      <tr>
                                        <td
                                          style="border-radius: 10px 10px 0 0"
                                          bgcolor="#ffffff"
                                        >
                                          <!-- Logo -->
                                          <div
                                            style="
                                              font-size: 15px;
                                              padding: 5px 50px;
                                              display: flex;
                                              align-items: center;
                                              justify-content: space-between;
                                              gap: 10px;
                                            "
                                          >
                                            <img
                                              style="height: 55px"
                                              src="https://zocare.onrender.com/assets/images/ZoCareW.png"
                                              alt="logo"
                                            />
                                            <h2>Zocare</h2>
                                          </div>
                                          <!-- Logo -->
                                          <!-- <hr> -->
                                          <!-- Main -->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellspacing="0"
                                            cellpadding="0"
                                          >
                                            <tr>
                                              <td
                                                class="px-50 mpx-15"
                                                style="
                                                  padding-left: 50px;
                                                  padding-right: 50px;
                                                "
                                              >
                                                <!-- Section - Intro -->
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pb-50"
                                                      style="padding-bottom: 50px"
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellspacing="0"
                                                        cellpadding="0"
                                                      >
                                                        <!-- <tr>
                                                                    <td
                                                                      class="fluid-img img-center pb-50"
                                                                      style="
                                                                        font-size: 0pt;
                                                                        line-height: 0pt;
                                                                        text-align: center;
                                                                        padding-bottom: 50px;
                                                                      "
                                                                    >
                                                                      <img
                                                                        src="../images/img_intro_4.png"
                                                                        width="368"
                                                                        height="296"
                                                                        border="0"
                                                                        alt=""
                                                                      />
                                                                    </td>
                                                                  </tr> -->
                                                        <hr />
                                                        <tr>
                                                          <td
                                                            class="title-36 a-center pb-15"
                                                            style="
                                                              font-size: 36px;
                                                              line-height: 40px;
                                                              color: #282828;
                                                              font-family: 'PT Sans',
                                                                Arial, sans-serif;
                                                              min-width: auto !important;
                                                              text-align: center;
                                                              padding-bottom: 15px;
                                                              padding-top: 15px;
                                                            "
                                                          >
                                                            <strong
                                                              >Forgot your
                                                              password?</strong
                                                            >
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td
                                                            class="text-16 lh-26 a-center pb-25"
                                                            style="
                                                              font-size: 16px;
                                                              color: #6e6e6e;
                                                              font-family: 'PT Sans',
                                                                Arial, sans-serif;
                                                              min-width: auto !important;
                                                              line-height: 26px;
                                                              text-align: center;
                                                              padding-bottom: 25px;
                                                            "
                                                          >
                                                            Click on the button below
                                                            to reset your password,
                                                            you have 5 mins to pick
                                                            your password. After that,
                                                            you'll have to ask for a
                                                            new one.
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td align="center">
                                                            <!-- Button -->
                                                            <table
                                                              border="0"
                                                              cellspacing="0"
                                                              cellpadding="0"
                                                              style="min-width: 200px"
                                                            >
                                                              <tr>
                                                                <td
                                                                  class="btn-16 c-white l-white"
                                                                  bgcolor="#1a1a70"
                                                                  style="
                                                                    font-size: 16px;
                                                                    line-height: 20px;
                                                                    mso-padding-alt: 15px
                                                                      35px;
                                                                    font-family: 'PT Sans',
                                                                      Arial,
                                                                      sans-serif;
                                                                    text-align: center;
                                                                    font-weight: bold;
                                                                    text-transform: uppercase;
                                                                    border-radius: 25px;
                                                                    min-width: auto !important;
                                                                    color: #ffffff;
                                                                  "
                                                                >
                                                                  <a
                                                                    href="${link2}"
                                                                    target="_blank"
                                                                    class="link c-white"
                                                                    style="
                                                                      display: block;
                                                                      padding: 15px
                                                                        35px;
                                                                      text-decoration: none;
                                                                      color: #ffffff;
                                                                    "
                                                                  >
                                                                    <span
                                                                      class="link c-white"
                                                                      style="
                                                                        text-decoration: none;
                                                                        color: #ffffff;
                                                                      "
                                                                      >RESET
                                                                      PASSWORD</span
                                                                    >
                                                                  </a>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                            <!-- END Button -->
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                                <!-- END Section - Intro -->
                                              </td>
                                            </tr>
                                          </table>
                                          <!-- END Main -->
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <!-- END Container -->
      
                              <!-- Footer -->
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    class="p-50 mpx-15"
                                    bgcolor="#e0e0ff"
                                    style="
                                      border-radius: 0 0 10px 10px;
                                      padding: 50px;
                                    "
                                  >
                                    <table
                                      width="100%"
                                      border="0"
                                      cellspacing="0"
                                      cellpadding="0"
                                    >
                                      <tr>
                                        <td
                                          class="text-14 lh-24 a-center c-white l-white pb-20"
                                          style="
                                            font-size: 14px;
                                            font-family: 'PT Sans', Arial, sans-serif;
                                            min-width: auto !important;
                                            line-height: 24px;
                                            text-align: center;
                                            color: black;
                                            padding-bottom: 20px;
                                          "
                                        >
                                          Address : Zocare, India
                                          <br />
                                          <a
                                            href="tel:+17384796719"
                                            target="_blank"
                                            class="link c-white"
                                            style="
                                              text-decoration: none;
                                              color: black;
                                            "
                                            ><span
                                              class="link c-white"
                                              style="
                                                text-decoration: none;
                                                color:black;
                                              "
                                            >
                                              Phn. : +91 9090909090</span
                                            ></a
                                          >
                                          <br />
                                          <a
                                            href="mailto:info@website.com"
                                            target="_blank"
                                            class="link c-white"
                                            style="
                                              text-decoration: none;
                                              color: black;
                                            "
                                            ><span
                                              class="link c-white"
                                              style="
                                                text-decoration: none;
                                                color: black;
                                              "
                                            >
                                              Zocare@gmail.com</span
                                            ></a
                                          >
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <!-- END Footer -->
      
                              <table
                                width="100%"
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    class="text-12 lh-22 a-center c-grey- l-grey py-20"
                                    style="
                                      font-size: 12px;
                                      color: #6e6e6e;
                                      font-family: 'PT Sans', Arial, sans-serif;
                                      min-width: auto !important;
                                      line-height: 22px;
                                      text-align: center;
                                      padding-top: 20px;
                                      padding-bottom: 20px;
                                    "
                                  >
                                    <a
                                      href="#"
                                      target="_blank"
                                      class="link c-grey"
                                      style="text-decoration: none; color: #6e6e6e"
                                      ><span
                                        class="link c-grey"
                                        style="
                                          white-space: nowrap;
                                          text-decoration: none;
                                          color: #6e6e6e;
                                        "
                                      ></span
                                    ></a>
      
                                    <a
                                      href="#"
                                      target="_blank"
                                      class="link c-grey"
                                      style="text-decoration: none; color: #6e6e6e"
                                      ><span
                                        class="link c-grey"
                                        style="
                                          white-space: nowrap;
                                          text-decoration: none;
                                          color: #6e6e6e;
                                        "
                                      ></span
                                    ></a>
      
                                    <a
                                      href="#"
                                      target="_blank"
                                      class="link c-grey"
                                      style="text-decoration: none; color: #6e6e6e"
                                      ><span
                                        class="link c-grey"
                                        style="
                                          white-space: nowrap;
                                          text-decoration: none;
                                          color: #6e6e6e;
                                        "
                                      ></span
                                    ></a>
                                  </td>
                                </tr>
                              </table>
                              <!-- END Bottom -->
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </center>
        </body>
      </html>
      `;
      const mailOptions = {
        from: constants.adminEmail,
        to: email,
        subject: "Password Reset",
        //   text: `You are receiving this because you (or someone else) has requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:\n\n
        // http://localhost:3000/resetpassword/${user.id}/${token} \n\n
        // If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        html: passbody,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Email sent successfully" });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).send(error);
  }
};

const resetpass = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(req.body, "body");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await Admin.findById(id);
    if (!user) {
      return res.status(500).send("Invalid user ID");
    }
    if (password.includes(" ")) {
      return res.status(500).json({ message: "Password should not have spaces." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (
      decodedToken.id !== user.id &&
      (decoded.role === "superadmin" || decoded.role === "admin")
    ) {
      return res.status(500).send("Invalid token");
    }

    // Hash the password before saving
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (decoded.role === "consultant") {
      const consultant = await Consultant.findById(req.user);
      if (decodedToken.id !== consultant.id && decoded.role === "consultant") {
        return res.status(500).send("Invalid token");
      }

      consultant.password = password;
      await consultant.save();
    }
    if (decoded.role === "doctor") {
      const doctor = await Doctor.findById(req.user);
      if (decodedToken.id !== doctor.id && decoded.role === "doctor") {
        return res.status(500).send("Invalid token");
      }

      doctor.password = password;
      await doctor.save();
    }

    user.password = password;
    await user.save();

    res.send("Password reset successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  AdminLogin,
  ConsultantLogin,
  DoctorLogin,
  forgotpassword,
  resetpass,
  superLogin,
};
