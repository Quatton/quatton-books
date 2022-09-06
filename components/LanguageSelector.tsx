import { Fragment, useContext } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  LanguageIcon,
} from "@heroicons/react/24/solid";
import { SettingContext } from "../utils/Settings";
import { useRouter } from "next/router";

const languages = [
  { id: "th", display: "ภาษาไทย" },
  { id: "en", display: "English" },
  { id: "ja", display: "日本語" },
];

export default function LangSelect() {
  const { settings, setSettings } = useContext(SettingContext);
  const router = useRouter();
  const { locale, locales, asPath, pathname, query } = router;

  function handleChange(value: string) {
    router.push({ pathname, query }, asPath, { locale: value, shallow: true });
    setSettings({ ...settings, lang: value });
  }

  return (
    <div className="ml-auto w-36">
      <Listbox value={locale} onChange={handleChange}>
        <div className="relative mt-1">
          <Listbox.Button
            className="
          flex items-center srelative w-full cursor-pointer rounded-lg bg-white 
          py-2 pl-3 pr-10 text-left shadow-md 
          focus:outline-none focus-visible:border-indigo-500 
          focus-visible:ring-2 focus-visible:ring-white 
          focus-visible:ring-opacity-75 focus-visible:ring-offset-2
          focus-visible:ring-offset-orange-300 text-sm"
          >
            <span className="mr-2">
              <LanguageIcon className="h-5 w-5 text-amber-700" />
            </span>
            <span className="block truncate">
              {languages.find((language) => language.id === locale)?.display}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {locales?.map((lang) => (
                <Listbox.Option
                  key={lang}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={lang}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          lang === locale ? "font-medium" : "font-normal"
                        }`}
                      >
                        {
                          languages.find((language) => language.id === lang)
                            ?.display
                        }
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
