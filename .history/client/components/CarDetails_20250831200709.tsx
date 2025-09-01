// components/CarDetails.tsx
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link"; // Importa el componente Link

import { Dialog, Transition } from "@headlessui/react";
import { Car } from "@/state/api";

interface CarDetailsProps {
  isOpen: boolean;
  closeModal: () => void;
  car: Car;
}

const CarDetails = ({ isOpen, closeModal, car }: CarDetailsProps) => (
  <>
    <Transition appear show={isOpen}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        {/* ✅ Aquí se corrige el primer error */}
        <Transition.Child
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            {/* ✅ Y aquí se corrige el segundo error */}
            <Transition.Child
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-out duration-300'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5'>
                <button
                  type='button'
                  className='absolute top-2 right-2 z-10 w-fit p-2 bg-primary-blue-100 rounded-full'
                  onClick={closeModal}
                >
                  <Image
                    src='/close.svg'
                    alt='close'
                    width={20}
                    height={20}
                    className='object-contain'
                  />
                </button>

                <div className='flex-1 flex flex-col gap-3'>
                  <div className='relative w-full h-40 bg-pattern bg-cover bg-center rounded-lg'>
                    {car.imagePaths && car.imagePaths.length > 0 && (
                      <Image src={car.images[0]} alt='car model' fill priority className='object-contain' />
                    )}
                  </div>

                  <div className='flex gap-3'>
                    {car.imagePaths && car.imagePaths.slice(1, 4).map((imagePath, index) => (
                      <div key={index} className='flex-1 relative w-full h-24 bg-primary-blue-100 rounded-lg'>
                        <Image src={imagePath} alt={`car model ${index + 2}`} fill priority className='object-contain' />
                      </div>
                    ))}
                  </div>
                </div>

                <div className='flex-1 flex flex-col gap-2'>
                  <h2 className='font-semibold text-xl capitalize'>
                    {car.carBrand} {car.name}
                  </h2>
                  <p className='text-gray-700 mt-2'>{car.description}</p>
                  <p className='text-2xl font-bold text-blue-600 mt-2'>${car.pricePerHour} / hora</p>

                  <div className='mt-3 flex flex-wrap gap-4'>
                    {car.characteristics && car.characteristics.length > 0 && (
                      <div className='w-full'>
                        <h4 className='text-grey capitalize font-medium mb-1'>Características:</h4>
                        <ul className='list-disc list-inside'>
                          {car.characteristics.map((char, index) => (
                            <li key={index}>{char}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className='flex justify-between gap-5 w-full text-right'>
                      <h4 className='text-grey capitalize'>Marca:</h4>
                      <p className='text-black-100 font-semibold'>{car.carBrand}</p>
                    </div>
                    <div className='flex justify-between gap-5 w-full text-right'>
                      <h4 className='text-grey capitalize'>Categoría:</h4>
                      <p className='text-black-100 font-semibold'>{car.category?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                {/* ✅ Agrega el Link al final */}
                <Link href={`/cars/${car.id}`} passHref>
                  <button
                    className='w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg mt-4'
                    onClick={closeModal} // Opcional: cierra el modal al hacer clic
                  >
                    Ver página completa
                  </button>
                </Link>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  </>
);

export default CarDetails;