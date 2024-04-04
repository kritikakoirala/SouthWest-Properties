import React, { useState } from "react";
import { FaFileCsv } from "react-icons/fa";
import Loading from "../Loading";
import Button from "../../common/Button";
import MultiStep from "react-multistep";
import Dropdown from "../../common/Dropdown";
import { AddressAutofill } from "@mapbox/search-js-react";
import { instance } from "../../config/config";

const Create = () => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [data, setData] = useState({
    property_type: ["townhouse", "apartment"],
    listing_property_type: ["lease"],
    bedroom: ["1", "2", "3", "4+"],
    bath: ["1", "2", "3", "4+"],
    utility: [],
    policies: [],
    amenities: [],
    address: "",
    sqFt: 0,
    rent: 0,
    imageLink: "",
  });

  const [selectedFeature, setSelectedFeature] = useState({
    street_address: "",
    property_type: "",
    listing_property_type: "",
    square_feet: 0,
    imageLink: "",
    bedroom: 0,
    bathroom: 0,
    heat: false,
    water: false,
    hydro: false,
    furnished: false,
    pet: false,
    smoking: false,
    gym: false,
    parking: false,
    ac: false,
    appliance: false,
    storage: false,
    rent: 0,
  });

  const [sampleRows, setSampleRows] = useState([
    "106 Dalkeith Drive, Dartmouth, Nova Scotia, B2W 4E8",
    "TownHouse",
    "1558.0",
    "4.0",
    "2.0",
    "0",
    "1",
    "0",
    "0",
    "0.0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ]);

  const expectedColumns = [
    "listingAddress",
    "listingPropertyType",
    "listingSizeSquareFeet",
    "bedroomCount",
    "bathroomCount",
    "heatUtility",
    "waterUtility",
    "hydroUtility",
    "furnishedUtility",
    "petPolicy",
    "smokingPolicy",
    "gymAmenity",
    "parkingAmenity",
    "acAmenity",
    "applianceAmenity",
    "storageAmenity",
  ];

  const [fileState, setFileState] = useState({
    succces: false,
    message: "",
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileNameParts = selectedFile.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];
      if (fileExtension !== "csv") {
        setErrorMessage("You can only upload a CSV file.");
        return;
      } else {
        // validateCSVColumns(selectedFile);
        if (selectedFile) {
          const currentDate = new Date().toISOString()?.replace(/[-:.]/g, "");
          const newName = `${selectedFile.name
            ?.split(".")
            ?.slice(0, -1)
            ?.join(".")}_${currentDate}.${selectedFile.name.split(".")?.pop()}`;
          const renamedFile = new File([selectedFile], newName, {
            type: selectedFile.type,
          });

          setFile(renamedFile);
        }
        setFile(selectedFile);
      }
    }
  };

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (!errorMessage) {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        // const response = await instance.post("/api/csv_upload", formData);
        // if (response) {
        //   setFileState({
        //     succces: true,
        //     message: response?.message,
        //   });
        //   setErrorMessage("");
        //   setLoading(false);
        // }
      } catch (error) {
        setFileState({
          succces: false,
          message: "",
        });
        setErrorMessage(
          "Something went wrong. Could not upload the file, please try again later"
        );
        setLoading(false);
      }
    }
  };

  const steps = [
    {
      title: "Basic Info",
      component: (
        <Basic
          data={data}
          setData={setData}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
        />
      ),
    },
    {
      title: "Utilities",
      component: (
        <Utilities
          data={data}
          setData={setData}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
        />
      ),
    },
    {
      title: "Policy",
      component: (
        <Policy
          data={data}
          setData={setData}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
        />
      ),
    },
    {
      title: "Amenities",
      component: (
        <Amenity
          data={data}
          setData={setData}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
        />
      ),
    },
  ];

  const onSingleModelSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    instance
      .post("/api/listings", selectedFeature, { timeout: 600000 })
      .then((res) => {
        setLoading(false);
        console.log(res);
        setSuccessMessage("Listing Added successfully!");
      })
      .catch((err) => {
        setLoading(false);
        setErrorMessage("Something went wrong. We couldn't add the listing.");
        console.log(err);
      });
    // console.log("@selectedFeature", selectedFeature);
  };

  return (
    <>
      <div className="w-50 mx-auto m-4 shadow">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              File Upload
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Manual Entry
            </button>
          </li>
        </ul>
        <div class="tab-content py-3" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <div className="w-75 mx-auto">
              <p
                class="border-0 bg-transparent cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <span className="text-primary-color">Note:</span>
                <span className="fs-9">
                  {" "}
                  Please look at the{" "}
                  <span className="text-decoration-underline fs-9 text-primary-color text-uppercase">
                    sample CSV
                  </span>{" "}
                  to know which format to upload the file
                </span>{" "}
              </p>
              <div>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  onChange={handleFileChange}
                  accept=".csv"
                />

                {file && !errorMessage && (
                  <p className="text-primary-color py-3">
                    {" "}
                    <FaFileCsv />
                    {file?.name}
                  </p>
                )}
                {errorMessage && (
                  <p className="text-danger fs-9 mt-3">{errorMessage}</p>
                )}
              </div>

              <div className="footer d-flex justify-content-center my-3">
                {loading ? <Loading /> : ""}
                <Button
                  onClick={onSubmit}
                  className=" px-2 py-2 bg-primary-color border-0 rounded-0  ms-2 fs-9"
                  disabled={
                    errorMessage !== "" || file === null || loading
                      ? true
                      : false
                  }
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            {errorMessage && (
              <p className="text-danger fs-9 mt-3 text-center">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="text-success fs-9 mt-3 text-center">
                {successMessage}
              </p>
            )}

            <div className=" px-4 mx-auto">
              <MultiStep
                activeStep={0}
                showNavigation={true}
                steps={steps}
                prevButton={{
                  title: "Back",
                  style: {
                    background: "transparent",
                    border: "1px solid #c1cd23",
                    color: "#c1cd23",
                    padding: ".2em 1.2em",
                  },
                }}
                nextButton={{
                  title: "Next",
                  style: {
                    background: "transparent",
                    border: "1px solid #c1cd23",
                    color: "#c1cd23",
                    padding: ".2em 1.2em",
                    margin: "2em 1em 0 1em",
                  },
                }}
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              {loading ? <Loading /> : ""}
              <Button
                onClick={onSingleModelSubmit}
                className="justify-content-center px-2 py-2 bg-primary-color border-0 rounded-0  ms-2 fs-9 my-3"
                disabled={loading ? true : false}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div className="modal-header text-center">
              <h3 className="fs-8 fw-bold mb-0">
                The uploaded CSV should be in this particular format.
              </h3>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive px-4">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      {expectedColumns &&
                        expectedColumns?.map((column, idx) => {
                          return (
                            <th className=" text-capitalize fs-9">{column}</th>
                          );
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="fs-8 text-secondary">
                      {sampleRows &&
                        sampleRows?.map((row, idx) => {
                          return <td>{row}</td>;
                        })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;

export const Basic = ({
  data,
  setData,
  selectedFeature,
  setSelectedFeature,
}) => {
  const addressChange = (e) => {
    setData((data) => ({ ...data, address: e?.target?.value }));
  };

  const handleRetrieve = (feature) => {
    setData((data) => ({
      ...data,
      address: feature?.features[0]?.properties?.full_address,
    }));
    setSelectedFeature((selectedFeature) => ({
      ...selectedFeature,
      street_address: feature?.features[0]?.properties?.full_address,
    }));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <Dropdown
          className={"me-2"}
          options={data?.property_type}
          title="Property Type"
          name="property_type"
          value={selectedFeature?.property_type || ""}
          onChange={(e) =>
            setSelectedFeature((selectedFeature) => ({
              ...selectedFeature,
              property_type: e?.target?.value,
            }))
          }
        />
        <Dropdown
          // className={"mx-2"}
          options={data?.listing_property_type}
          title="Listing Property Type"
          name="listing_property_type"
          value={selectedFeature?.listing_property_type || ""}
          onChange={(e) =>
            setSelectedFeature((selectedFeature) => ({
              ...selectedFeature,
              listing_property_type: e?.target?.value,
            }))
          }
        />
      </div>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <Dropdown
          className={"me-2"}
          options={data?.bedroom}
          title="Bedroom"
          name="bedroom"
          value={selectedFeature?.bedroom || ""}
          onChange={(e) =>
            setSelectedFeature((selectedFeature) => ({
              ...selectedFeature,
              bedroom: parseInt(e?.target?.value),
            }))
          }
        />
        <Dropdown
          options={data?.bath}
          title="Baths"
          name="bathroom"
          value={selectedFeature?.bathroom || ""}
          onChange={(e) =>
            setSelectedFeature((selectedFeature) => ({
              ...selectedFeature,
              bathroom: parseInt(e?.target?.value),
            }))
          }
        />
      </div>
      <div>
        <div className="my-4 custom-border d-flex justify-content-between">
          <div className="w-75 autocomplete-address">
            <AddressAutofill
              onRetrieve={handleRetrieve}
              accessToken={`${process.env.REACT_APP_MAPBOX_TOKEN}`}
            >
              <input
                className="form-control border-0 border-bottom rounded-0 fs-8 py-1 px-0 w-100 "
                name="address"
                placeholder="Type your postal address like 5672 Cornel st...."
                type="text"
                autoComplete="address-line1"
                onChange={addressChange}
                value={data?.address}
              />
            </AddressAutofill>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <input
            className="form-control"
            placeholder="Listing Sq ft"
            type="number"
            name="square_feet"
            value={selectedFeature?.square_feet || ""}
            onChange={(e) =>
              setSelectedFeature((selectedFeature) => ({
                ...selectedFeature,
                square_feet: parseInt(e?.target?.value),
              }))
            }
          />
          <input
            className="form-control mx-2"
            placeholder="Rent"
            type="number"
            name="rent"
            value={selectedFeature?.rent || ""}
            onChange={(e) =>
              setSelectedFeature((selectedFeature) => ({
                ...selectedFeature,
                rent: parseInt(e?.target?.value),
              }))
            }
          />

          <input
            className="form-control "
            placeholder="Image Link"
            type="text"
            name="imageLink"
            value={selectedFeature?.imageLink || ""}
            onChange={(e) =>
              setSelectedFeature((selectedFeature) => ({
                ...selectedFeature,
                imageLink: e?.target?.value,
              }))
            }
          />
        </div>
      </div>
    </>
  );
};
export const Utilities = ({ selectedFeature, setSelectedFeature }) => {
  const allUtilities = ["heat", "water", "hydro", "furnished"];

  const utilityChange = (e) => {
    const { name, value, checked } = e?.target;
    // console.log(data);

    console.log(checked ? true : false);

    setSelectedFeature((selectedFeature) => ({
      ...selectedFeature,
      [value]: checked ? true : false,
    }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-wrap">
      {allUtilities?.map((utility, idx) => {
        return (
          <div class="form-check form-check-inline" onChange={utilityChange}>
            <input
              class="form-check-input"
              type="checkbox"
              id={idx}
              value={utility}
              name={utility}
            />
            <label class="form-check-label text-capitalize fs-8" for={idx}>
              {utility}
            </label>
          </div>
        );
      })}
    </div>
  );
};
export const Policy = ({ selectedFeature, setSelectedFeature }) => {
  const allPolicies = ["pet", "smoking"];

  const policyChange = (e) => {
    const { name, value, checked } = e?.target;

    setSelectedFeature((selectedFeature) => ({
      ...selectedFeature,
      [value]: checked ? true : false,
    }));
  };
  return (
    <div className="d-flex justify-content-center align-items-center flex-wrap">
      {allPolicies?.map((policy, idx) => {
        return (
          <div class="form-check form-check-inline" onChange={policyChange}>
            <input
              class="form-check-input"
              type="checkbox"
              id={idx}
              value={policy}
              name={policy}
            />
            <label class="form-check-label text-capitalize fs-8" for={idx}>
              {policy}
            </label>
          </div>
        );
      })}
    </div>
  );
};
export const Amenity = ({ selectedFeature, setSelectedFeature }) => {
  const allAmenities = ["gym", "parking", "ac", "appliance", "storage"];

  const onamenityChange = (e) => {
    const { name, value, checked } = e?.target;

    setSelectedFeature((selectedFeature) => ({
      ...selectedFeature,
      [value]: checked ? true : false,
    }));
  };
  return (
    <div className="d-flex justify-content-center align-items-center flex-wrap">
      {" "}
      {allAmenities?.map((amenity, idx) => {
        return (
          <div class="form-check form-check-inline" onChange={onamenityChange}>
            <input
              class="form-check-input"
              type="checkbox"
              id={idx}
              value={amenity}
              name={amenity}
            />
            <label class="form-check-label text-capitalize fs-8" for={idx}>
              {amenity}
            </label>
          </div>
        );
      })}
    </div>
  );
};
