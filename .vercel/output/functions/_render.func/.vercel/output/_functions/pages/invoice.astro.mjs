/* empty css                                     */
import { c as createComponent, r as renderTemplate, a as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_B0HlvySp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_B0g-I8HC.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import React, { useEffect } from 'react';
import { I as Input, B as Button } from '../chunks/Input_CLPAG-wE.mjs';
import { g as generateInvoice, t as templates } from '../chunks/invoiceUtils_CfpSvSIY.mjs';
export { renderers } from '../renderers.mjs';

function Dropdown({ options, label, id, labelPosition, value, setValue, placeholder, className }) {
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs("div", { className: `${className} w-full relative z-10 gap-2 ${labelPosition === "top" ? "flex-col" : "flex-row items-center"}`, children: [
    label && /* @__PURE__ */ jsxs("label", { htmlFor: id, children: [
      label,
      ":"
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `${label && "mt-2"} flex justify-between items-center p-2 cursor-pointer bg-white rounded-md`,
        onClick: () => setOpen(!open),
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder,
              value,
              className: "cursor-pointer max-w-48 bg-white focus:outline-none",
              onChange: (e) => setValue(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/icons/DropArrow.svg",
              alt: "dropdown arrow",
              className: "w-8"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "relative w-full", onBlur: () => setOpen(false), children: /* @__PURE__ */ jsx("div", { className: `${open ? "visible" : "hidden"} border shadow-xl rounded-lg transition-all overflow-hidden absolute top-0 w-full`, children: options.map((option, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "p-2 cursor-pointer bg-white hover:bg-gray-100",
        onClick: () => {
          setValue(option);
          setOpen(false);
        },
        children: option
      },
      index
    )) }) })
  ] });
}

function ServicesTable({ services, setServices }) {
  useEffect(() => {
    const savedServices = localStorage.getItem("services");
    if (savedServices && JSON.parse(savedServices).length > 0) {
      setServices(JSON.parse(savedServices));
    }
  }, []);
  const handleNameChange = (index) => (e) => {
    handleServiceChange("name", e, index);
    saveToLocalStorage(services);
  };
  const handleValueChange = (index) => (e) => {
    handleServiceChange("value", e, index);
    saveToLocalStorage(services);
  };
  const handleServiceChange = (prop, e, index) => {
    const newServices = [...services];
    newServices[index][prop] = prop === "value" ? parseInt(e.target.value) : e.target.value;
    setServices(newServices);
  };
  const saveToLocalStorage = (services2) => {
    localStorage.setItem("services", JSON.stringify(services2));
  };
  const handleAddRow = () => {
    saveToLocalStorage([...services, {
      id: services.length,
      name: "",
      value: 0
    }]);
    setServices([...services, {
      id: services.length,
      name: "",
      value: 0
    }]);
  };
  const handleDeleteRow = (index) => {
    const newServices = services.filter((service, i) => i !== index);
    if (newServices.length === 0) {
      newServices.push({
        id: 0,
        name: "",
        value: 0
      });
    }
    saveToLocalStorage(newServices);
    setServices(newServices);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "text-left flex flex-col gap-1",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-md flex bg-white", children: [
            /* @__PURE__ */ jsxs("div", { className: "w-full flex", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1/2 font-bold p-2", children: "Servicio" }),
              /* @__PURE__ */ jsx("div", { className: "w-1/2 font-bold p-2", children: "Valor" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-10 font-bold p-2" })
          ] }),
          services.map((service, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex relative items-center",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "w-full flex", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-1/2 ", children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "service",
                      placeholder: "Nombre del servicio",
                      value: service.name,
                      onInput: handleNameChange(index),
                      type: "text"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "w-1/2 bg-white h-full", children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "value",
                      value: service.value.toString(),
                      type: "number",
                      onInput: handleValueChange(index)
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-12 bg-white h-full p-2", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-8 h-8 bg-red-500 p-2 hover:bg-red-700 cursor-pointer rounded-md",
                    onClick: () => handleDeleteRow(index),
                    children: /* @__PURE__ */ jsx("img", { src: "/icons/trash.svg", alt: "delete" })
                  }
                ) })
              ]
            },
            index
          ))
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "w-full mt-2 rounded-md bg-gray-200 hover:bg-gray-400",
        onClick: handleAddRow,
        children: "+"
      }
    )
  ] });
}

function InvoiceGenerator() {
  useEffect(() => {
    setCustomer("Ensafe SAS");
  }, []);
  const [services, setServices] = React.useState([{
    id: 0,
    name: "",
    value: 0
  }]);
  const [service, setService] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const handleInvoice = () => {
    const invoice = {
      company: customer,
      services
    };
    generateInvoice(invoice);
  };
  const handleCustomer = (customer2) => {
    setCustomer(customer2);
    setServices([{ id: 0, name: "", value: 0 }]);
  };
  const handleServiceTemplate = (service2) => {
    setService(service2);
    const template = templates.find((t) => t.name === service2);
    if (!template) return;
    setServices([{
      id: 0,
      name: template.description,
      value: template.company === customer ? template.value : 0
    }]);
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center gap-5", children: /* @__PURE__ */ jsxs("div", { className: "w-full h-[calc(100vh-80px)] flex flex-col justify-between gap-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
        /* @__PURE__ */ jsx(
          Dropdown,
          {
            id: "customer",
            value: customer,
            label: "",
            setValue: handleCustomer,
            options: ["Ensafe SAS", "Stunnink Walls"],
            placeholder: "Selecciona un cliente"
          }
        ),
        /* @__PURE__ */ jsx(
          Dropdown,
          {
            id: "service",
            value: service,
            label: "",
            setValue: handleServiceTemplate,
            options: ["Manejo de redes", "Identidad Corporativa", "Página web"],
            placeholder: "Selecciona un servicio"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(ServicesTable, { services, setServices })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => handleInvoice(),
        text: "Generar cuenta de cobro"
      }
    ) })
  ] }) });
}

const prerender = false;
const $$Invoice = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cuentas de cobro" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "InvoiceGenerator", InvoiceGenerator, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/features/invoice/components/InvoiceGenerator", "client:component-export": "default" })} </section> ` })}`;
}, "C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/pages/invoice.astro", void 0);

const $$file = "C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/pages/invoice.astro";
const $$url = "/invoice";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Invoice,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
