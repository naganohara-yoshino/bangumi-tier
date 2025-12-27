<div
    class="flex flex-col-reverse min-w-screen overflow-clip bg-gray-300 lg:flex-row-reverse lg:min-h-screen lg:h-screen"
>
    <div
        class="flex flex-col p-8 justify-center items-center w-full lg:h-full lg:w-2/5 bg-white"
    >
        <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={() => alert("Button clicked!")}
        >
            Click Me
        </button>
        <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={() => alert("Button clicked!")}
        >
            Click Me
        </button>
        <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={() => alert("Button clicked!")}
        >
            Click Me
        </button>
    </div>
    <div class="flex flex-1 justify-center p-8">
        <p>Main Content Area</p>
    </div>
</div>
