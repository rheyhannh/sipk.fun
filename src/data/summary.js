/*
============================== CODE START HERE ==============================
*/
const getUserIpk = (matkul) => {
  if (matkul.length !== 0) {
    const totalSks = getUserSks(matkul);
    const { totalNilaiAkhir } = matkul.reduce((sum, current) => {
      return {
        totalNilaiAkhir: sum.totalNilaiAkhir + current.nilai.akhir
      };
    }, { totalNilaiAkhir: 0 }
    );
    return (totalNilaiAkhir / totalSks).toFixed(2);
  }

  return -1
}

const getUserIpkPercentage = (user, matkul) => {
  if (user.length !== 0) {
    const ipk = getUserIpk(matkul);
    const ipkTarget = user[0].ipk_target || null;
    const ipkPercentage = ipkTarget ? Math.round((ipk / ipkTarget) * 100) : Math.round((ipk / 4) * 100);

    return ipkPercentage > 100 ? 100 : ipkPercentage
  }

  return -1
}

const getUserSks = (matkul) => {
  if (matkul.length !== 0) {
    const { totalSks } = matkul.reduce((sum, current) => {
      return {
        totalSks: sum.totalSks + current.sks,
      };
    }, { totalSks: 0 }
    );
    return totalSks;
  }

  return -1
}

const getUserSksPercentage = (user, matkul) => {
  if (user.length !== 0) {
    const sks = getUserSks(matkul);
    const sksTarget = user[0].sks_target || null;
    const sksPercentage = sksTarget ? Math.round((sks / sksTarget) * 100) : Math.round((sks / 144) * 100);

    return sksPercentage > 100 ? 100 : sksPercentage
  }

  return -1
}

const getUserMatkul = (matkul) => {
  if (matkul) {
    return matkul.length
  }

  return -1
}

const getUserMatkulPercentage = (user, matkul) => {
  if (user.length !== 0) {
    const matkulTotal = matkul.length;
    const matkulTarget = user[0].matkul_target || null;
    const matkulPercentage = matkulTarget ? Math.round((matkulTotal / matkulTarget) * 100) : Math.round((matkulTotal / 50) * 100)

    return matkulPercentage > 100 ? 100 : matkulPercentage
  }

  return -1
}

const getAllSemester = (matkul, sort = false) => {
  if (matkul.length !== 0) {
    const allSemester = [...new Set(matkul.map(item => item.semester))];
    return sort ? allSemester.sort((x, y) => x - y) : allSemester;
  }

  return -1
}

const getStatsSemester = (matkul, sort = false) => {
  if (matkul.length !== 0) {
    const groupBySemester = matkul.reduce((acc, item) => {
      const key = item.semester;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    const statsSemester = Object.values(groupBySemester).map(group => {
      const totalNilai = group.reduce((sum, item) => sum + item.nilai.akhir, 0);
      const totalSks = group.reduce((sum, item) => sum + item.sks, 0);
      const count = group.length;
      const semester = group[0].semester;

      return { totalNilai, totalSks, count, semester };
    });

    return sort ? statsSemester.sort((a, b) => a.semester - b.semester) : statsSemester;
  }

  return -1
}

const getStatsByNilai = (matkul, universitas, sort = false) => {
  if (matkul.length !== 0) {
    const statsByNilai = Object.values(universitas).map((x, index) => {
      const keyNilai = Object.keys(universitas);
      const entries = matkul.filter(item => item.nilai.indeks === keyNilai[index]);
      const totalSks = entries.reduce((sum, item) => sum + item.sks, 0);
      const totalMatakuliah = entries.length;
  
      return {
        indeks: keyNilai[index],
        totalSks,
        totalMatakuliah,
        style: x.style,
        weight: x.weight,
      };
    });

    return sort ? statsByNilai.sort((a, b) => b.weight - a.weight) : statsByNilai;
  }

  return -1;
}

module.exports = {
  getUserIpk,
  getUserIpkPercentage,
  getUserMatkul,
  getUserMatkulPercentage,
  getUserSks,
  getUserSksPercentage,
  getAllSemester,
  getStatsSemester,
  getStatsByNilai,
}