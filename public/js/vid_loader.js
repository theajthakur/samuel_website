function updateExerciseText() {
    const fitnessGoal = document.getElementById('trainingGoal').value;
    var measurementInfos = document.querySelectorAll('.measurement-info');
    var bodybuildingInfo = document.getElementById('for_bodybuilding');
    var upperArmLabel = document.querySelector('label[for="upperArm"]');
    var waistLabel = document.querySelector('label[for="waist"]');
    var hipLabel = document.querySelector('label[for="hip"]');
    var thighLabel = document.querySelector('label[for="thigh"]');
    var upperArmInput = document.getElementById('upperArm');
    var waistInput = document.getElementById('waist');
    var hipInput = document.getElementById('hip');
    var thighInput = document.getElementById('thigh');

    if (fitnessGoal == "muscleGain") {
        measurementInfos.forEach(function(element) {
            element.setAttribute('style', 'display: none;');
        });
        if (bodybuildingInfo) {
            bodybuildingInfo.removeAttribute('style');
        }
        // Rename labels, ids, and names
        upperArmLabel.textContent = "Brustumfang (cm):";
        upperArmLabel.setAttribute('for', 'upperArm');
        upperArmInput.id = "upperArm";
        upperArmInput.name = "chest";

        waistLabel.textContent = "Bizeps (cm):";
        waistLabel.setAttribute('for', 'waist');
        waistInput.id = "waist";
        waistInput.name = "biceps";

        hipLabel.textContent = "Waden (cm):";
        hipLabel.setAttribute('for', 'hip');
        hipInput.id = "hip";
        hipInput.name = "calf";

    } else {
        measurementInfos.forEach(function(element) {
            element.removeAttribute('style');
        });
        if (bodybuildingInfo) {
            bodybuildingInfo.setAttribute('style', 'display: none;');
        }
        // Reset labels, ids, and names to initial values
        upperArmLabel.textContent = "Oberarm (cm):";
        upperArmLabel.setAttribute('for', 'upperArm');
        upperArmInput.id = "upperArm";
        upperArmInput.name = "upperArm";

        waistLabel.textContent = "Taille (cm):";
        waistLabel.setAttribute('for', 'waist');
        waistInput.id = "waist";
        waistInput.name = "waist";

        hipLabel.textContent = "Hüfte (cm):";
        hipLabel.setAttribute('for', 'hip');
        hipInput.id = "hip";
        hipInput.name = "hip";

        thighLabel.textContent = "Oberschenkel (cm):";
        thighLabel.setAttribute('for', 'thigh');
        thighInput.id = "thigh";
        thighInput.name = "thigh";
    }
}


function updateExerciseInfo() {
	const fitnessLevel = document.getElementById('fitnessLevel').value;
	const weights = {
		beginner: { reps: 10, weight: 30 },
		intermediate: { reps: 15, weight: 40 },
		advanced: { reps: 20, weight: 50 }
	};
	const repsElement = document.getElementById('reps');
	const weightUsedElement = document.getElementById('weightUsed');
	if (fitnessLevel) {
		if (repsElement) {
			repsElement.textContent = weights[fitnessLevel].reps;
		}
		if (weightUsedElement) {
			weightUsedElement.textContent = weights[fitnessLevel].weight;
		}
	} else {
		if (repsElement) {
			repsElement.textContent = '...';
		}
		if (weightUsedElement) {
			weightUsedElement.textContent = '...';
		}
	}
}

document.getElementById('fitnessLevel').addEventListener("input", updateExerciseInfo);
document.getElementById('trainingGoal').addEventListener("change", updateExerciseText);

try {

	document.addEventListener("DOMContentLoaded", function() {
		const inputs = document.querySelectorAll("input:not([required])");
		const textareas = document.querySelectorAll("textarea:not([required])");

		inputs.forEach(input => input.setAttribute("required", "required"));
		textareas.forEach(textarea => textarea.setAttribute("required", "required"));
	});


	var vidDiv = document.querySelector(".video-controller");
	if (!vidDiv) throw new Error("Video controller element not found");

	var url = document.location.href;
	var x = url.split("/").pop();
	var vidSrc = "";

	switch (x) {
		case "gym":
			vidSrc = "gym.mp4";
			break;
		case "no_equipment":
			vidSrc = "homewithout.mp4";
			break;
		case "equipment":
			vidSrc = "homewith.mp4";
			break;
		default:
			throw new Error("Invalid URL segment: " + x);
	}

	vidDiv.innerHTML = "<center><video id='exerciseVideo' src='/assets/video/" + vidSrc + "' width='80%' controls autoplay></video></center>";

	var videoElement = document.getElementById('exerciseVideo');
	videoElement.addEventListener('ended', function() {
		var x=document.getElementById("NextButton");
		if(!x){
			var nextButton = document.createElement('button');
			nextButton.textContent = "weiter";
			nextButton.id = "NextButton";
			nextButton.style.display = "block";
			nextButton.style.marginTop = "10px";
			nextButton.onclick = function() {
				var vidDiv = document.querySelector(".video-controller");
				if (vidDiv) {
					vidDiv.remove();
					var bodyDiv = document.querySelector("#fitnessForm");
					if(bodyDiv){
						bodyDiv.removeAttribute("style");
						window.scrollTo(0, 0);
					}
				}
			};
			vidDiv.appendChild(nextButton);
			window.scrollTo(0, 1000);
		}
	});
} catch (error) {
	console.error(error.message);
	// Optionally, you can display an error message to the user or take some other action
	if (vidDiv) {
		vidDiv.innerHTML = "<p>Sorry, the video could not be loaded. Please try again later.</p>";
	}
}
